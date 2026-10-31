"use client";

import { Box, Images } from "lucide-react";
import { useState } from "react";
import { GlbViewer } from "@/components/marketing/ThreeDViewer";
import { SmartImage } from "@/components/ui/SmartImage";
import { cn } from "@/lib/utils";

export function ProductGallery({ images, name, slug, modelUrl }: { images: string[]; name: string; slug: string; modelUrl?: string | null }) {
  const slots: (string | null)[] = images.length ? images : [null, null, null];
  const [active, setActive] = useState(0);
  const [view, setView] = useState<"photos" | "3d">("photos");
  const show3d = view === "3d" && !!modelUrl;

  return (
    <div className="space-y-4">
      {modelUrl && (
        <div role="tablist" aria-label="Product media" className="inline-flex border border-line p-1">
          {([["photos", "Photos", Images], ["3d", "3D view", Box]] as const).map(([id, label, Icon]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={view === id}
              onClick={() => setView(id)}
              className={cn(
                "inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition-colors",
                view === id ? "bg-ink text-white" : "text-neutral-600 hover:text-ink",
              )}
            >
              <Icon size={15} /> {label}
            </button>
          ))}
        </div>
      )}
      <div className="relative aspect-square overflow-hidden border border-line bg-brand-cream">
        {show3d ? (
          <div className="absolute inset-0 bg-charcoal-deep">
            <GlbViewer src={modelUrl} />
          </div>
        ) : (
          <SmartImage
            key={active}
            src={slots[active]}
            alt={`${name} — view ${active + 1}`}
            seed={`${slug}-${active}`}
            tone="light"
            priority
            sizes="(min-width:1024px) 50vw, 100vw"
          />
        )}
      </div>
      {slots.length > 1 && !show3d && (
        <div className="grid grid-cols-4 gap-3">
          {slots.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show view ${i + 1}`}
              aria-current={i === active}
              className={cn("relative aspect-square overflow-hidden border-2 bg-brand-cream transition-colors", i === active ? "border-ink" : "border-transparent hover:border-neutral-400")}
            >
              <SmartImage src={src} alt="" seed={`${slug}-${i}`} tone="light" sizes="120px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
