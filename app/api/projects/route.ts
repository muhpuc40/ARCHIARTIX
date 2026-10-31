import { revalidatePath } from "next/cache";
import { guardApi } from "@/lib/api-auth";
import { jsonError, jsonOk } from "@/lib/http";
import { slugify } from "@/lib/utils";
import { projectSchema } from "@/lib/validators";

/** POST — admin adds a project. The first image becomes the cover. */
export async function POST(request: Request) {
  const guard = await guardApi(request, { admin: true });
  if (!guard.ok) return guard.response;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError(400, "Invalid request.");
  }
  const parsed = projectSchema.safeParse(body);
  if (!parsed.success) return jsonError(422, parsed.error.issues[0]?.message ?? "Invalid project.");

  const { slug: given, images, ...rest } = parsed.data;
  const base = given || slugify(rest.title) || "project";

  for (let attempt = 0; attempt < 4; attempt++) {
    const slug = attempt === 0 ? base : `${base}-${Math.random().toString(36).slice(2, 6)}`;
    const { data, error } = await guard.supabase
      .from("projects")
      .insert({
        ...rest,
        slug,
        category_id: rest.category_id ?? null,
        location: rest.location || null,
        year: rest.year ?? null,
        area_sqft: rest.area_sqft ?? null,
        images,
        cover_image_url: images[0] ?? null,
      })
      .select("id")
      .single();
    if (!error) {
      revalidatePath("/", "layout");
      return jsonOk({ id: data.id }, 201);
    }
    if (error.code !== "23505") return jsonError(500, "Could not create the project.");
  }
  return jsonError(409, "A project with that title already exists.");
}
