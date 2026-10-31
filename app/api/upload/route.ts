import { guardApi } from "@/lib/api-auth";
import { isCloudinaryConfigured, signUpload } from "@/lib/cloudinary";
import { jsonError, jsonOk } from "@/lib/http";
import { rateLimit } from "@/lib/rate-limit";
import { IMAGE_MIME, MODEL_MIME, uploadRequestSchema } from "@/lib/validators";

/**
 * POST — admin asks for a signed Cloudinary upload. The browser then uploads the
 * file straight to Cloudinary using the returned URL + fields (images and video).
 */
export async function POST(request: Request) {
  const guard = await guardApi(request, { admin: true });
  if (!guard.ok) return guard.response;
  if (!isCloudinaryConfigured) {
    return jsonError(503, "Cloudinary isn’t configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET to .env.local.");
  }

  const limit = rateLimit(`upload:${guard.userId}`, 80, 10 * 60_000);
  if (!limit.ok) return jsonError(429, "Too many uploads — slow down for a moment.");

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError(400, "Invalid request.");
  }
  const parsed = uploadRequestSchema.safeParse(body);
  if (!parsed.success) return jsonError(422, parsed.error.issues[0]?.message ?? "Unsupported file.");

  const isImage = (IMAGE_MIME as readonly string[]).includes(parsed.data.contentType);
  const isModel = (MODEL_MIME as readonly string[]).includes(parsed.data.contentType);
  // 3D models (.glb) are stored as Cloudinary "raw" files.
  const signed = signUpload({
    folder: parsed.data.folder,
    resourceType: isModel ? "raw" : isImage ? "image" : "video",
    allowedFormats: isModel ? undefined : isImage ? "jpg,jpeg,png,webp,avif" : "mp4,webm,mov",
  });
  return jsonOk(signed);
}
