import { revalidatePath } from "next/cache";
import { dbErrorMessage, guardApi } from "@/lib/api-auth";
import { jsonError, jsonOk } from "@/lib/http";
import { orderStatusSchema } from "@/lib/validators";
import { z } from "zod";

/** PATCH — admin moves an order along its allowed status transitions (enforced by a DB trigger too). */
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await guardApi(request, { admin: true });
  if (!guard.ok) return guard.response;

  const { id } = await params;
  if (!z.string().uuid().safeParse(id).success) return jsonError(400, "Invalid order id.");

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError(400, "Invalid request.");
  }
  const parsed = orderStatusSchema.safeParse(body);
  if (!parsed.success) return jsonError(422, "Invalid status.");

  const { data, error } = await guard.supabase
    .from("orders")
    .update({ status: parsed.data.status })
    .eq("id", id)
    .select("id, status")
    .maybeSingle();

  if (error) {
    const e = dbErrorMessage(error, "Could not update the order.");
    return jsonError(e.code === "UNKNOWN" ? 500 : 409, e.message);
  }
  if (!data) return jsonError(404, "Order not found.");

  revalidatePath("/shop"); // cancelling restores stock
  return jsonOk({ order: data });
}
