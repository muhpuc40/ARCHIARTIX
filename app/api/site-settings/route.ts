import { revalidatePath } from "next/cache";
import { guardApi } from "@/lib/api-auth";
import { jsonError, jsonOk } from "@/lib/http";
import { siteSettingsSchema } from "@/lib/validators";

/** PUT — admin saves the landing-page 3D model / video links. An empty value removes the setting. */
export async function PUT(request: Request) {
  const guard = await guardApi(request, { admin: true });
  if (!guard.ok) return guard.response;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError(400, "Invalid request.");
  }
  const parsed = siteSettingsSchema.safeParse(body);
  if (!parsed.success) return jsonError(422, parsed.error.issues[0]?.message ?? "Invalid settings.");

  for (const [key, raw] of Object.entries(parsed.data)) {
    if (raw === undefined) continue; // not part of this save
    const value = (raw ?? "").trim();
    const { error } = value
      ? await guard.supabase.from("site_settings").upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" })
      : await guard.supabase.from("site_settings").delete().eq("key", key);
    if (error) return jsonError(500, "Could not save the settings.");
  }
  revalidatePath("/");
  return jsonOk();
}
