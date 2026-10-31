import { NextResponse } from "next/server";
import { getProductsByIds } from "@/lib/data";
import { jsonError } from "@/lib/http";
import { cartValidateSchema } from "@/lib/validators";

/** Public: returns the live price/stock of cart products that still exist and are published. */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError(400, "Invalid request.");
  }
  const parsed = cartValidateSchema.safeParse(body);
  if (!parsed.success) return jsonError(422, "Invalid cart.");

  const products = await getProductsByIds(parsed.data.ids);
  return NextResponse.json(
    {
      ok: true,
      products: products.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        price_bdt: p.price_bdt,
        stock: p.stock,
        image: p.images[0] ?? null,
      })),
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
