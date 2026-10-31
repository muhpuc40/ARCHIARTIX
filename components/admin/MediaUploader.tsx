"use client";

import { Box, ImagePlus, Loader2, Video, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { useToast } from "@/components/ui/Toast";
import { IMAGE_MIME, MAX_IMAGE_BYTES, MAX_MODEL_BYTES, MAX_VIDEO_BYTES, MODEL_MIME, VIDEO_MIME } from "@/lib/validators";

type Folder = "products" | "projects" | "testimonials" | "hero" | "models" | "site";

/**
 * Uploads to Cloudinary using a one-time signature from /api/upload (admin only).
 * `kind="image"` shows a thumbnail grid (first = cover); `kind="video"` accepts video files;
 * `kind="model"` accepts a 3D model (.glb).
 */
export function MediaUploader({
  folder,
  value,
  onChange,
  max = 8,
  kind = "image",
}: {
  folder: Folder;
  value: string[];
  onChange: (urls: string[]) => void;
  max?: number;
  kind?: "image" | "video" | "model";
}) {
  const toast = useToast();
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const accept: readonly string[] = kind === "video" ? VIDEO_MIME : kind === "model" ? MODEL_MIME : IMAGE_MIME;
  const maxBytes = kind === "video" ? MAX_VIDEO_BYTES : kind === "model" ? MAX_MODEL_BYTES : MAX_IMAGE_BYTES;
  const hint =
    kind === "video" ? "MP4, WebM or MOV · up to 100 MB"
    : kind === "model" ? `GLB 3D model · up to ${Math.round(MAX_MODEL_BYTES / 1024 / 1024)} MB`
    : "JPG, PNG, WebP or AVIF · up to 8 MB each";

  async function uploadOne(file: File): Promise<string | null> {
    // Browsers rarely know the .glb type, so go by the file extension for models.
    const contentType = kind === "model" ? (/\.glb$/i.test(file.name) ? MODEL_MIME[0] : "") : file.type;
    if (!accept.includes(contentType)) {
      toast({ title: "Unsupported file", description: `${file.name}: ${kind === "video" ? "use MP4, WebM or MOV" : kind === "model" ? "use a .glb file" : "use JPG, PNG, WebP or AVIF"}.`, tone: "error" });
      return null;
    }
    if (file.size > maxBytes) {
      toast({ title: "File too large", description: `${file.name} is over ${Math.round(maxBytes / 1024 / 1024)} MB.`, tone: "error" });
      return null;
    }
    const sig = await fetch("/api/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ folder, contentType, size: file.size }),
    });
    const json = await sig.json().catch(() => ({}));
    if (!sig.ok) {
      toast({ title: "Upload failed", description: json.error, tone: "error" });
      return null;
    }
    const form = new FormData();
    form.append("file", file);
    for (const [k, v] of Object.entries(json.fields as Record<string, string | number>)) form.append(k, String(v));
    const res = await fetch(json.uploadUrl as string, { method: "POST", body: form });
    const out = await res.json().catch(() => ({}));
    if (!res.ok || !out.secure_url) {
      toast({ title: "Upload failed", description: out?.error?.message ?? "Cloudinary rejected the file.", tone: "error" });
      return null;
    }
    return out.secure_url as string;
  }

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    const room = max - value.length;
    if (room <= 0) {
      toast({ title: `Maximum ${max} file${max === 1 ? "" : "s"}`, tone: "error" });
      return;
    }
    setBusy(true);
    const added: string[] = [];
    for (const file of Array.from(files).slice(0, room)) {
      const url = await uploadOne(file);
      if (url) added.push(url);
    }
    setBusy(false);
    if (input.current) input.current.value = "";
    if (added.length) onChange([...value, ...added]);
  }

  return (
    <div className="space-y-3">
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {value.map((url, i) => (
          <li key={url} className="group relative aspect-square overflow-hidden border border-line bg-neutral-100">
            {kind === "model" ? (
              <span className="grid h-full w-full place-items-center bg-ink p-2 text-center text-white">
                <span>
                  <Box size={26} className="mx-auto text-brand-yellow" />
                  <span className="mt-1 block break-all text-[10px] leading-tight text-white/70">{decodeURIComponent(url.split("/").pop() ?? "model.glb")}</span>
                </span>
              </span>
            ) : kind === "video" ? (
              <video src={url} muted playsInline preload="metadata" className="h-full w-full object-cover" />
            ) : (
              <Image src={url} alt={`Image ${i + 1}`} fill sizes="160px" className="object-cover" />
            )}
            {kind === "image" && i === 0 && <span className="absolute left-1 top-1 bg-brand-yellow px-2 py-0.5 text-[10px] font-bold uppercase">Cover</span>}
            <button
              type="button"
              onClick={() => onChange(value.filter((u) => u !== url))}
              aria-label={`Remove file ${i + 1}`}
              className="absolute right-1 top-1 bg-ink p-1 text-white sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
            >
              <X size={14} />
            </button>
            {kind === "image" && i > 0 && (
              <button
                type="button"
                onClick={() => onChange([url, ...value.filter((u) => u !== url)])}
                className="absolute inset-x-0 bottom-0 bg-ink/80 py-1 text-[10px] font-semibold uppercase text-white sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
              >
                Make cover
              </button>
            )}
          </li>
        ))}
        {value.length < max && (
          <li>
            <button
              type="button"
              onClick={() => input.current?.click()}
              disabled={busy}
              className="flex aspect-square w-full flex-col items-center justify-center gap-2 border-2 border-dashed border-neutral-300 text-xs font-semibold text-neutral-500 transition-colors hover:border-ink hover:text-ink disabled:opacity-60"
            >
              {busy ? <Loader2 size={22} className="animate-spin" /> : kind === "video" ? <Video size={22} /> : kind === "model" ? <Box size={22} /> : <ImagePlus size={22} />}
              {busy ? "Uploading…" : kind === "video" ? "Add video" : kind === "model" ? "Add .glb" : "Add images"}
            </button>
          </li>
        )}
      </ul>
      <input ref={input} type="file" accept={kind === "model" ? ".glb,model/gltf-binary" : accept.join(",")} multiple={max > 1} hidden onChange={(e) => onFiles(e.target.files)} />
      <p className="text-xs text-neutral-500">
        {hint} · stored on Cloudinary.
      </p>
    </div>
  );
}
