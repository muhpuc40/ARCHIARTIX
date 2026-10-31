import { revalidatePath } from "next/cache";
import { z } from "zod";
import { guardApi } from "@/lib/api-auth";
import { jsonError, jsonOk } from "@/lib/http";
import { productSchema } from "@/lib/validators";

type Ctx = { params: Promise<{ id: string }> };
const idSchema = z.string().uuid();

function refresh(slug?: string) {
  revalidatePath("/shop");
  revalidatePath("/sitemap.xml");
  if (slug) revalidatePath(`/shop/${slug}`);
}

/** PATCH — admin edits a product (partial updates allowed, e.g. the publish toggle). */
export async function PATCH(request: Request, { params }: Ctx) {
  const guard = await guardApi(request, { admin: true });
  if (!guard.ok) return guard.response;
  const { id } = await params;
  if (!idSchema.safeParse(id).success) return jsonError(400, "Invalid product id.");

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError(400, "Invalid request.");
  }
  const parsed = productSchema.partial().safeParse(body);
  if (!parsed.success) return jsonError(422, parsed.error.issues[0]?.message ?? "Invalid product.");

  const update = { ...parsed.data };
  if (update.slug === "") delete update.slug;

  const { data, error } = await guard.supabase.from("products").update(update).eq("id", id).select("id, slug").maybeSingle();
  if (error) return jsonError(error.code === "23505" ? 409 : 500, error.code === "23505" ? "That URL slug is already used." : "Could not update the product.");
  if (!data) return jsonError(404, "Product not found.");
  refresh(data.slug);
  return jsonOk({ product: data });
}

/** DELETE — admin removes a product (past order lines keep their name/price snapshot). */
export async function DELETE(request: Request, { params }: Ctx) {
  const guard = await guardApi(request, { admin: true });
  if (!guard.ok) return guard.response;
  const { id } = await params;
  if (!idSchema.safeParse(id).success) return jsonError(400, "Invalid product id.");

  const { data, error } = await guard.supabase.from("products").delete().eq("id", id).select("slug").maybeSingle();
  if (error) return jsonError(500, "Could not delete the product.");
  if (!data) return jsonError(404, "Product not found.");
  refresh(data.slug);
  return jsonOk();
}
