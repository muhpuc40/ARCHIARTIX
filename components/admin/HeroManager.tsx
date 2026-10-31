"use client";

import { ArrowDown, ArrowUp, Eye, EyeOff, Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { MediaUploader } from "@/components/admin/MediaUploader";
import { useToast } from "@/components/ui/Toast";
import type { HeroSlide } from "@/lib/types";

export function HeroManager({ slides }: { slides: HeroSlide[] }) {
  const router = useRouter();
  const toast = useToast();
  const [busy, setBusy] = useState<string | null>(null);

  async function call(url: string, method: string, body?: unknown) {
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) toast({ title: "Couldn’t save", description: json.error, tone: "error" });
    return res.ok;
  }

  async function add(urls: string[]) {
    setBusy("add");
    let saved = 0;
    for (const image_url of urls) {
      if (await call("/api/hero-slides", "POST", { image_url, is_published: true })) saved++;
      else break;
    }
    setBusy(null);
    if (saved) toast({ title: `${saved} hero image${saved === 1 ? "" : "s"} added`, tone: "success" });
    router.refresh();
  }

  async function togglePublished(s: HeroSlide) {
    setBusy(s.id);
    await call(`/api/hero-slides/${s.id}`, "PATCH", { is_published: !s.is_published });
    setBusy(null);
    router.refresh();
  }

  async function move(index: number, dir: -1 | 1) {
    const a = slides[index];
    const b = slides[index + dir];
    if (!a || !b) return;
    setBusy(a.id);
    // Re-number everything so equal sort_order values can never block a swap.
    const order = slides.map((s) => s.id);
    [order[index], order[index + dir]] = [order[index + dir], order[index]];
    for (let i = 0; i < order.length; i++) {
      const s = slides.find((x) => x.id === order[i])!;
      if (s.sort_order !== i + 1) await call(`/api/hero-slides/${s.id}`, "PATCH", { sort_order: i + 1 });
    }
    setBusy(null);
    router.refresh();
  }

  async function saveCaption(s: HeroSlide, caption: string) {
    if ((s.caption ?? "") === caption.trim()) return;
    if (await call(`/api/hero-slides/${s.id}`, "PATCH", { caption })) {
      toast({ title: "Caption saved", tone: "success" });
      router.refresh();
    }
  }

  return (
    <div className="space-y-8">
      <section className="border border-line bg-white p-6">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.14em]">
          Add images {busy === "add" && <Loader2 size={14} className="animate-spin" />}
        </h2>
        <MediaUploader folder="hero" max={10 - slides.length} value={[]} onChange={add} />
        <p className="mt-3 text-xs text-neutral-500">Wide images (16:9, at least 1920 px) look best. Up to 10 images · {slides.length} used.</p>
      </section>

      {slides.length === 0 ? (
        <p className="border border-dashed border-neutral-300 py-16 text-center text-neutral-500">No hero images yet — visitors see the animated hero only.</p>
      ) : (
        <ol className="space-y-4">
          {slides.map((s, i) => (
            <li key={s.id} className="flex flex-wrap items-center gap-4 border border-line bg-white p-4">
              <span className="w-6 text-center text-sm font-bold text-neutral-400">{i + 1}</span>
              <div className="relative h-24 w-40 shrink-0 overflow-hidden bg-neutral-100">
                <Image src={s.image_url} alt={s.caption || `Hero image ${i + 1}`} fill sizes="160px" className="object-cover" />
                {!s.is_published && <span className="absolute inset-0 grid place-items-center bg-ink/60 text-[10px] font-bold uppercase tracking-wider text-white">Hidden</span>}
              </div>
              <label className="min-w-[200px] flex-1 text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500">
                Caption (optional)
                <input
                  defaultValue={s.caption ?? ""}
                  maxLength={120}
                  onBlur={(e) => saveCaption(s, e.target.value)}
                  placeholder="e.g. Duplex in Khulshi, Chattogram"
                  className="mt-1 block w-full border border-line px-3 py-2 text-sm font-normal normal-case tracking-normal text-ink outline-none focus:border-ink"
                />
              </label>
              <div className="flex items-center gap-1">
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0 || busy !== null} aria-label="Move earlier" className="p-2 hover:bg-neutral-200 disabled:opacity-30"><ArrowUp size={16} /></button>
                <button type="button" onClick={() => move(i, 1)} disabled={i === slides.length - 1 || busy !== null} aria-label="Move later" className="p-2 hover:bg-neutral-200 disabled:opacity-30"><ArrowDown size={16} /></button>
                <button type="button" onClick={() => togglePublished(s)} disabled={busy !== null} aria-label={s.is_published ? "Hide image" : "Show image"} className="p-2 hover:bg-neutral-200 disabled:opacity-30">
                  {s.is_published ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
                <DeleteButton endpoint={`/api/hero-slides/${s.id}`} noun="Hero image" name={s.caption || `Image ${i + 1}`} />
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
