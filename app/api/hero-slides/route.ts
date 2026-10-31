import { revalidatePath } from "next/cache";
import { guardApi } from "@/lib/api-auth";
import { jsonError, jsonOk } from "@/lib/http";
import { heroSlideSchema } from "@/lib/validators";

/** POST — admin adds a hero image (already uploaded to Cloudinary; we store its URL). */
export async function POST(request: Request) {
  const guard = await guardApi(request, { admin: true });
  if (!guard.ok) return guard.response;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError(400, "Invalid request.");
  }
  const parsed = heroSlideSchema.safeParse(body);
  if (!parsed.success) return jsonError(422, parsed.error.issues[0]?.message ?? "Invalid image.");

  const { count } = await guard.supabase.from("hero_slides").select("id", { count: "exact", head: true });
  if ((count ?? 0) >= 10) return jsonError(409, "You can keep up to 10 hero images. Delete one to add another.");

  const { data, error } = await guard.supabase
    .from("hero_slides")
    .insert({ ...parsed.data, caption: parsed.data.caption || null, sort_order: parsed.data.sort_order || (count ?? 0) + 1 })
    .select("id")
    .single();
  if (error) return jsonError(500, "Could not save the image.");
  revalidatePath("/");
  return jsonOk({ id: data.id }, 201);
}
