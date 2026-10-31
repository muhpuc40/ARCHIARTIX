"use client";

import { ImagePlus, Loader2, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { useToast } from "@/components/ui/Toast";
import { createClient } from "@/lib/supabase/client";

const MAX_BYTES = 5 * 1024 * 1024;
const ACCEPT = ["image/jpeg", "image/png", "image/webp", "image/avif"];

/** Uploads straight to Supabase Storage using one-time signed URLs minted by /api/upload (admin only). */
export function ImageUploader({
  bucket,
  value,
  onChange,
  max = 8,
}: {
  bucket: "products" | "projects";
  value: string[];
  onChange: (urls: string[]) => void;
  max?: number;
}) {
  const toast = useToast();
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function uploadOne(file: File): Promise<string | null> {
    if (!ACCEPT.includes(file.type)) {
      toast({ title: "Unsupported file", description: `${file.name}: use JPG, PNG, WebP or AVIF.`, tone: "error" });
      return null;
    }
    if (file.size > MAX_BYTES) {
      toast({ title: "File too large", description: `${file.name} is over 5 MB.`, tone: "error" });
      return null;
    }
    const res = await fetch("/api/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bucket, filename: file.name, contentType: file.type, size: file.size }),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      toast({ title: "Upload failed", description: json.error, tone: "error" });
      return null;
    }
    const { error } = await createClient().storage.from(bucket).uploadToSignedUrl(json.path, json.token, file, { contentType: file.type });
    if (error) {
      toast({ title: "Upload failed", description: error.message, tone: "error" });
      return null;
    }
    return json.publicUrl as string;
  }

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    const room = max - value.length;
    if (room <= 0) {
      toast({ title: `Maximum ${max} images`, tone: "error" });
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
            <Image src={url} alt={`Product image ${i + 1}`} fill sizes="160px" className="object-cover" />
            {i === 0 && <span className="absolute left-1 top-1 bg-brand-yellow px-2 py-0.5 text-[10px] font-bold uppercase">Cover</span>}
            <button
              type="button"
              onClick={() => onChange(value.filter((u) => u !== url))}
              aria-label={`Remove image ${i + 1}`}
              className="absolute right-1 top-1 bg-ink p-1 text-white opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
            >
              <X size={14} />
            </button>
            {i > 0 && (
              <button
                type="button"
                onClick={() => onChange([url, ...value.filter((u) => u !== url)])}
                className="absolute inset-x-0 bottom-0 bg-ink/80 py-1 text-[10px] font-semibold uppercase text-white opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
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
              {busy ? <Loader2 size={22} className="animate-spin" /> : <ImagePlus size={22} />}
              {busy ? "Uploading…" : "Add images"}
            </button>
          </li>
        )}
      </ul>
      <input ref={input} type="file" accept={ACCEPT.join(",")} multiple hidden onChange={(e) => onFiles(e.target.files)} />
      <p className="text-xs text-neutral-500">JPG, PNG, WebP or AVIF · up to 5 MB each · first image is the cover.</p>
    </div>
  );
}
