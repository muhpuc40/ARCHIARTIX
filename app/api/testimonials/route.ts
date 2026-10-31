import { revalidatePath } from "next/cache";
import { guardApi } from "@/lib/api-auth";
import { jsonError, jsonOk } from "@/lib/http";
import { testimonialSchema } from "@/lib/validators";

/** POST — admin adds a testimonial. */
export async function POST(request: Request) {
  const guard = await guardApi(request, { admin: true });
  if (!guard.ok) return guard.response;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError(400, "Invalid request.");
  }
  const parsed = testimonialSchema.safeParse(body);
  if (!parsed.success) return jsonError(422, parsed.error.issues[0]?.message ?? "Invalid testimonial.");

  const { data, error } = await guard.supabase
    .from("testimonials")
    .insert({ ...parsed.data, role: parsed.data.role || null, location: parsed.data.location || null, avatar_url: parsed.data.avatar_url ?? null })
    .select("id")
    .single();
  if (error) return jsonError(500, "Could not save the testimonial.");
  revalidatePath("/");
  return jsonOk({ id: data.id }, 201);
}
