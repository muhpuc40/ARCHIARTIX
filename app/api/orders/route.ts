import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { dbErrorMessage, guardApi } from "@/lib/api-auth";
import { jsonError, jsonOk } from "@/lib/http";
import { rateLimit } from "@/lib/rate-limit";
import { orderCreateSchema } from "@/lib/validators";

/** POST — a signed-in customer places an order (prices & stock are decided in the database). */
export async function POST(request: Request) {
  const guard = await guardApi(request);
  if (!guard.ok) return guard.response;

  const limit = rateLimit(`order:${guard.userId}`, 6, 10 * 60_000);
  if (!limit.ok) return jsonError(429, "Too many orders in a short time. Please wait a few minutes.");

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError(400, "Invalid request.");
  }
  const parsed = orderCreateSchema.safeParse(body);
  if (!parsed.success) return jsonError(422, parsed.error.issues[0]?.message ?? "Invalid order.");

  const { data, error } = await guard.supabase.rpc("create_order", {
    items: parsed.data.items,
    shipping: parsed.data.shipping,
    payment: parsed.data.payment,
  });

  if (error) {
    const e = dbErrorMessage(error, "We couldn't place your order. Please try again.");
    const status = e.code === "UNKNOWN" ? 500 : e.code === "AUTH" ? 401 : 409;
    if (e.code === "UNKNOWN") console.error("[orders] create_order failed:", error.message);
    return jsonError(status, e.message, { code: e.code });
  }

  // stock changed — refresh cached product pages
  revalidatePath("/shop");
  return jsonOk({ order: data });
}

/** GET — admin order list (optional ?status=). */
export async function GET(request: Request) {
  const guard = await guardApi(request, { admin: true });
  if (!guard.ok) return guard.response;

  const status = new URL(request.url).searchParams.get("status");
  let q = guard.supabase
    .from("orders")
    .select("*, order_items(*)")
    .order("created_at", { ascending: false })
    .limit(200);
  if (status) q = q.eq("status", status);

  const { data, error } = await q;
  if (error) return jsonError(500, "Could not load orders.");
  return NextResponse.json({ ok: true, orders: data });
}
