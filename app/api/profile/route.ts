import { guardApi } from "@/lib/api-auth";
import { jsonError, jsonOk } from "@/lib/http";
import { profileSchema } from "@/lib/validators";

/** PATCH — a signed-in user updates their own name / phone. (Role can't be changed: DB trigger.) */
export async function PATCH(request: Request) {
  const guard = await guardApi(request);
  if (!guard.ok) return guard.response;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError(400, "Invalid request.");
  }
  const parsed = profileSchema.safeParse(body);
  if (!parsed.success) return jsonError(422, parsed.error.issues[0]?.message ?? "Invalid details.");

  const { error } = await guard.supabase
    .from("profiles")
    .update({ full_name: parsed.data.full_name, phone: parsed.data.phone || null })
    .eq("id", guard.userId);
  if (error) return jsonError(500, "Could not save your details.");
  return jsonOk();
}
