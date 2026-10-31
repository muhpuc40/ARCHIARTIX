import "server-only";
import { createHash } from "node:crypto";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME ?? "";
const apiKey = process.env.CLOUDINARY_API_KEY ?? "";
const apiSecret = process.env.CLOUDINARY_API_SECRET ?? "";

export const isCloudinaryConfigured = Boolean(cloudName && apiKey && apiSecret);

/**
 * Builds the signed parameters the browser needs to upload straight to Cloudinary.
 * The API secret never leaves the server; the signature only covers these exact params.
 */
export function signUpload(opts: { folder: string; resourceType: "image" | "video" | "raw"; allowedFormats?: string }) {
  const timestamp = Math.floor(Date.now() / 1000);
  const params: Record<string, string | number> = {
    ...(opts.allowedFormats ? { allowed_formats: opts.allowedFormats } : {}),
    folder: `archiaetix/${opts.folder}`,
    timestamp,
  };
  const toSign = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");
  const signature = createHash("sha1").update(toSign + apiSecret).digest("hex");
  return {
    uploadUrl: `https://api.cloudinary.com/v1_1/${cloudName}/${opts.resourceType}/upload`,
    fields: { ...params, api_key: apiKey, signature },
  };
}
