import { z } from "zod";
import { guardApi } from "@/lib/api-auth";
import { jsonError, jsonOk } from "@/lib/http";
import { inquiryStatusSchema } from "@/lib/validators";

/** PATCH — admin marks an inquiry new / read / replied / archived. */
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await guardApi(request, { admin: true });
  if (!guard.ok) return guard.response;
  const { id } = await params;
  if (!z.string().uuid().safeParse(id).success) return jsonError(400, "Invalid id.");

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError(400, "Invalid request.");
  }
  const parsed = inquiryStatusSchema.safeParse(body);
  if (!parsed.success) return jsonError(422, "Invalid status.");

  const { data, error } = await guard.supabase.from("inquiries").update({ status: parsed.data.status }).eq("id", id).select("id").maybeSingle();
  if (error) return jsonError(500, "Could not update.");
  if (!data) return jsonError(404, "Not found.");
  return jsonOk();
}
