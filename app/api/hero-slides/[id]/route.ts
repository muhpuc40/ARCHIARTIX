import { revalidatePath } from "next/cache";
import { z } from "zod";
import { guardApi } from "@/lib/api-auth";
import { jsonError, jsonOk } from "@/lib/http";
import { heroSlideSchema } from "@/lib/validators";

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
  const parsed = heroSlideSchema.partial().safeParse(body);
  if (!parsed.success) return jsonError(422, parsed.error.issues[0]?.message ?? "Invalid image.");

  const update: Record<string, unknown> = { ...parsed.data };
  if ("caption" in update) update.caption = update.caption || null;

  const { data, error } = await guard.supabase.from("hero_slides").update(update).eq("id", id).select("id").maybeSingle();
  if (error) return jsonError(500, "Could not update the image.");
  if (!data) return jsonError(404, "Image not found.");
  revalidatePath("/");
  return jsonOk();
}

export async function DELETE(request: Request, { params }: Ctx) {
  const guard = await guardApi(request, { admin: true });
  if (!guard.ok) return guard.response;
  const { id } = await params;
  if (!idSchema.safeParse(id).success) return jsonError(400, "Invalid id.");
  const { data, error } = await guard.supabase.from("hero_slides").delete().eq("id", id).select("id").maybeSingle();
  if (error) return jsonError(500, "Could not delete the image.");
  if (!data) return jsonError(404, "Image not found.");
  revalidatePath("/");
  return jsonOk();
}
