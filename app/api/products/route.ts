import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { guardApi } from "@/lib/api-auth";
import { getProducts } from "@/lib/data";
import { jsonError, jsonOk } from "@/lib/http";
import { slugify } from "@/lib/utils";
import { productSchema } from "@/lib/validators";

/** GET — published products (?q=, ?category=, ?limit=). Admins may pass ?all=1 for everything. */
export async function GET(request: Request) {
  const sp = new URL(request.url).searchParams;

  if (sp.get("all") === "1") {
    const guard = await guardApi(request, { admin: true });
    if (!guard.ok) return guard.response;
    const { data, error } = await guard.supabase.from("products").select("*").order("created_at", { ascending: false });
    if (error) return jsonError(500, "Could not load products.");
    return NextResponse.json({ ok: true, products: data });
  }

  const limit = Math.min(Number(sp.get("limit")) || 48, 100);
  const products = await getProducts({
    q: sp.get("q") ?? undefined,
    category: sp.get("category") ?? undefined,
    limit,
  });
  return NextResponse.json({ ok: true, products }, { headers: { "Cache-Control": "public, s-maxage=60" } });
}

/** POST — admin creates a product. */
export async function POST(request: Request) {
  const guard = await guardApi(request, { admin: true });
  if (!guard.ok) return guard.response;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError(400, "Invalid request.");
  }
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) return jsonError(422, parsed.error.issues[0]?.message ?? "Invalid product.");

  const base = parsed.data.slug || slugify(parsed.data.name) || "product";
  const { slug: _ignored, ...rest } = parsed.data;
  void _ignored;

  for (let attempt = 0; attempt < 4; attempt++) {
    const slug = attempt === 0 ? base : `${base}-${Math.random().toString(36).slice(2, 6)}`;
    const { data, error } = await guard.supabase
      .from("products")
      .insert({ ...rest, category_id: rest.category_id ?? null, slug })
      .select("id, slug")
      .single();
    if (!error) {
      revalidatePath("/shop");
      revalidatePath("/sitemap.xml");
      return jsonOk({ product: data }, 201);
    }
    if (error.code !== "23505") return jsonError(500, "Could not create the product.");
  }
  return jsonError(409, "A product with that name already exists.");
}
