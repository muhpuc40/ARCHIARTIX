import { revalidatePath } from "next/cache";
import { z } from "zod";
import { guardApi } from "@/lib/api-auth";
import { jsonError, jsonOk } from "@/lib/http";
import { testimonialSchema } from "@/lib/validators";

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
  const parsed = testimonialSchema.partial().safeParse(body);
  if (!parsed.success) return jsonError(422, parsed.error.issues[0]?.message ?? "Invalid testimonial.");

  const update: Record<string, unknown> = { ...parsed.data };
  if ("role" in update) update.role = update.role || null;
  if ("location" in update) update.location = update.location || null;

  const { data, error } = await guard.supabase.from("testimonials").update(update).eq("id", id).select("id").maybeSingle();
  if (error) return jsonError(500, "Could not update the testimonial.");
  if (!data) return jsonError(404, "Testimonial not found.");
  revalidatePath("/");
  return jsonOk();
}

export async function DELETE(request: Request, { params }: Ctx) {
  const guard = await guardApi(request, { admin: true });
  if (!guard.ok) return guard.response;
  const { id } = await params;
  if (!idSchema.safeParse(id).success) return jsonError(400, "Invalid id.");
  const { data, error } = await guard.supabase.from("testimonials").delete().eq("id", id).select("id").maybeSingle();
  if (error) return jsonError(500, "Could not delete the testimonial.");
  if (!data) return jsonError(404, "Testimonial not found.");
  revalidatePath("/");
  return jsonOk();
}
