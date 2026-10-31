"use client";

import { useState } from "react";
import { SmartImage } from "@/components/ui/SmartImage";
import { cn } from "@/lib/utils";

export function ProductGallery({ images, name, slug }: { images: string[]; name: string; slug: string }) {
  const slots: (string | null)[] = images.length ? images : [null, null, null];
  const [active, setActive] = useState(0);

  return (
    <div className="space-y-4">
      <div className="relative aspect-square overflow-hidden border border-line bg-brand-cream">
        <SmartImage
          key={active}
          src={slots[active]}
          alt={`${name} — view ${active + 1}`}
          seed={`${slug}-${active}`}
          tone="light"
          priority
          sizes="(min-width:1024px) 50vw, 100vw"
        />
      </div>
      {slots.length > 1 && (
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
