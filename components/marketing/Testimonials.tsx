"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Stars } from "@/components/ui/Stars";
import { siteConfig } from "@/lib/site";
import type { Testimonial } from "@/lib/types";
import { cn } from "@/lib/utils";

const siteName = siteConfig.name;

export function Testimonials({ items }: { items: Testimonial[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = items.length;

  useEffect(() => {
    if (paused || count < 2) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % count), 7000);
    return () => window.clearInterval(id);
  }, [paused, count]);

  if (count === 0) return null;
  const t = items[index % count]!;
  const go = (d: number) => setIndex((i) => (i + d + count) % count);
  const subtitle = [t.role, t.location].filter(Boolean).join(" · ");

  return (
    <section className="py-24 sm:py-32" aria-roledescription="carousel" aria-label="Client testimonials">
      <Container>
        <SectionHeading align="center" eyebrow="Kind words" title="Clients who now love where they live and work" />
        <div
          className="relative mx-auto mt-14 max-w-5xl"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          <Quote size={64} className="absolute -top-8 left-0 text-brand-yellow" aria-hidden strokeWidth={1.5} />
          <div className="min-h-[260px] overflow-hidden border-l-4 border-brand-yellow bg-brand-cream" aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.figure
                key={t.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.45 }}
                className={cn("grid", t.project_photo_url && "md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]")}
              >
                {t.project_photo_url && (
                  <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[360px]">
                    <Image src={t.project_photo_url} alt={`Project by ${siteName} for ${t.name}`} fill sizes="(min-width:768px) 40vw, 100vw" className="object-cover" />
                  </div>
                )}
                <div className="flex flex-col justify-center px-8 py-12 sm:px-12">
                  <Stars value={t.rating} size={18} className="mb-4 text-brand-yellow-deep" />
                  <blockquote className={cn("font-serif leading-relaxed", t.project_photo_url ? "text-lg sm:text-xl" : "text-xl sm:text-2xl lg:text-[1.65rem]")}>
                    “{t.quote}”
                  </blockquote>
                  <figcaption className="mt-8 flex items-center gap-4 text-sm">
                    {t.avatar_url ? (
                      <span className="relative h-12 w-12 overflow-hidden rounded-full bg-ink">
                        <Image src={t.avatar_url} alt="" fill sizes="48px" className="object-cover" />
                      </span>
                    ) : (
                      <span className="grid h-12 w-12 place-items-center rounded-full bg-ink font-serif text-lg text-brand-yellow" aria-hidden>
                        {t.name[0]}
                      </span>
                    )}
                    <span>
                      <span className="block font-bold">{t.name}</span>
                      {subtitle && <span className="text-neutral-600">{subtitle}</span>}
                    </span>
                  </figcaption>
                </div>
              </motion.figure>
            </AnimatePresence>
          </div>
          {count > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="flex gap-2" role="tablist" aria-label="Choose testimonial">
                {items.map((item, i) => (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={i === index % count}
                    aria-label={`Testimonial ${i + 1}`}
                    onClick={() => setIndex(i)}
                    className={cn("h-2 rounded-full transition-all duration-300", i === index % count ? "w-10 bg-ink" : "w-2 bg-neutral-300 hover:bg-neutral-500")}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => go(-1)} aria-label="Previous testimonial" className="grid h-11 w-11 place-items-center border border-ink transition-colors hover:bg-brand-yellow">
                  <ChevronLeft size={20} />
                </button>
                <button type="button" onClick={() => go(1)} aria-label="Next testimonial" className="grid h-11 w-11 place-items-center border border-ink transition-colors hover:bg-brand-yellow">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
