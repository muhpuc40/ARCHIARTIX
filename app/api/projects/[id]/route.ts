import { revalidatePath } from "next/cache";
import { z } from "zod";
import { guardApi } from "@/lib/api-auth";
import { jsonError, jsonOk } from "@/lib/http";
import { projectSchema } from "@/lib/validators";

type Ctx = { params: Promise<{ id: string }> };
const idSchema = z.string().uuid();

export async function PATCH(request: Request, { params }: Ctx) {
  const guard = await guardApi(request, { admin: true });
  if (!guard.ok) return guard.response;
  const { id } = await params;
  if (!idSchema.safeParse(id).success) return jsonError(400, "Invalid id.");

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError(400, "Invalid request.");
  }
  const parsed = projectSchema.partial().safeParse(body);
  if (!parsed.success) return jsonError(422, parsed.error.issues[0]?.message ?? "Invalid project.");

  const update: Record<string, unknown> = { ...parsed.data };
  if (update.slug === "") delete update.slug;
  if ("location" in update) update.location = update.location || null;
  if (Array.isArray(update.images)) update.cover_image_url = (update.images as string[])[0] ?? null;

  const { data, error } = await guard.supabase.from("projects").update(update).eq("id", id).select("id").maybeSingle();
  if (error) return jsonError(error.code === "23505" ? 409 : 500, error.code === "23505" ? "That URL slug is already used." : "Could not update the project.");
  if (!data) return jsonError(404, "Project not found.");
  revalidatePath("/", "layout");
  return jsonOk();
}

export async function DELETE(request: Request, { params }: Ctx) {
  const guard = await guardApi(request, { admin: true });
  if (!guard.ok) return guard.response;
  const { id } = await params;
  if (!idSchema.safeParse(id).success) return jsonError(400, "Invalid id.");
  const { data, error } = await guard.supabase.from("projects").delete().eq("id", id).select("id").maybeSingle();
  if (error) return jsonError(500, "Could not delete the project.");
  if (!data) return jsonError(404, "Project not found.");
  revalidatePath("/", "layout");
  return jsonOk();
}
