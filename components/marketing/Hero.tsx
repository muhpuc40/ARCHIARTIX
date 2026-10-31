"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/ui/Container";
import { HERO_TIMING } from "@/lib/hero-config";
import type { HeroSlide } from "@/lib/types";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Home hero. Cycle (timings in lib/hero-config.ts):
 *   animated hero (20s) → admin image 1 … N (10s each) → animated hero (20s) → repeat
 * Without admin images only the animated hero is shown.
 */
export function Hero({ slides = [] }: { slides?: HeroSlide[] }) {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  // -1 = animated hero, 0..n-1 = image index
  const [phase, setPhase] = useState(-1);
  // Not tied to "reduce motion": the slideshow is a slow opacity crossfade (no movement), and gating it on a
  // browser-only value would also cause a server/client hydration mismatch.
  const cycling = slides.length > 0;
  const showingImage = cycling && phase >= 0;

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const markY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    if (!cycling) return;
    const ms = (phase === -1 ? HERO_TIMING.animatedSeconds : HERO_TIMING.slideSeconds) * 1000;
    const id = window.setTimeout(() => setPhase((p) => (p === -1 ? 0 : p + 1 >= slides.length ? -1 : p + 1)), ms);
    return () => window.clearTimeout(id);
  }, [cycling, phase, slides.length]);

  return (
    <section ref={sectionRef} className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-ink text-white">
      {/* 1 — animated blueprint art (fades out while admin images show) */}
      <div className={cn("absolute inset-0 transition-opacity duration-[1400ms]", showingImage && "opacity-0")} aria-hidden>
      <div className="blueprint-bg absolute inset-0" />
      <svg
        className="draw-line absolute inset-0 h-full w-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        aria-hidden
      >
        <path d="M980 -20 L1360 920" stroke="#FADF0B" strokeWidth="3" opacity=".75" style={{ ["--len" as string]: 1100 }} />
        <path d="M760 900 L1020 380 L1150 640" stroke="#fff" strokeOpacity=".28" strokeWidth="2" className="delay-1" style={{ ["--len" as string]: 1000 }} />
        <path d="M820 560 H1380" stroke="#FADF0B" strokeWidth="2" opacity=".6" className="delay-2" style={{ ["--len" as string]: 600 }} />
        <circle cx="1040" cy="380" r="220" stroke="#fff" strokeOpacity=".1" strokeWidth="1.5" className="delay-3" style={{ ["--len" as string]: 1400 }} />
        <circle cx="1040" cy="380" r="320" stroke="#fff" strokeOpacity=".06" strokeWidth="1.5" className="delay-4" style={{ ["--len" as string]: 2100 }} />
      </svg>
      <div className="absolute -right-40 top-1/4 h-[620px] w-[620px] rounded-full bg-brand-yellow/10 blur-[120px]" />
      </div>

      {/* 2 — admin images (crossfade; only the current one and the next are mounted) */}
      {cycling &&
        slides.map((slide, i) => {
          const next = phase === -1 ? 0 : (phase + 1) % slides.length;
          if (i !== phase && i !== next) return null;
          return (
            <div key={slide.id} className={cn("absolute inset-0 transition-opacity duration-[1400ms]", i === phase ? "opacity-100" : "opacity-0")} aria-hidden={i !== phase}>
              <Image src={slide.image_url} alt={slide.caption || ""} fill priority={i === 0} sizes="100vw" className="object-cover" />
            </div>
          );
        })}

      {/* 3 — overlay for legibility */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-r from-ink via-ink/70 to-ink/20 transition-opacity duration-[1400ms]",
          showingImage && "opacity-0",
        )}
        aria-hidden
      />
      <div
        className={cn("absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-ink/30 opacity-0 transition-opacity duration-[1400ms]", showingImage && "opacity-100")}
        aria-hidden
      />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent" aria-hidden />

      {/* The "A" mark, floating on the right */}
      <motion.div
        style={{ y: reduce ? 0 : markY, opacity: fade }}
        className={cn("pointer-events-none absolute right-[4%] top-1/2 hidden -translate-y-1/2 transition-opacity duration-[1400ms] lg:block", showingImage && "!opacity-0")}
        aria-hidden
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.85, rotate: -4 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1.4, delay: 0.4, ease }}
        >
          <Image
            src="/brand/mark-light.png"
            alt=""
            width={588}
            height={470}
            priority
            className="h-auto w-[min(34vw,500px)] animate-float drop-shadow-[0_30px_60px_rgba(0,0,0,0.5)]"
          />
        </motion.div>
      </motion.div>

      {/* 4 — content */}
      <Container className={cn("relative z-10 pb-24 pt-36 transition-opacity duration-[1400ms]", showingImage && "pointer-events-none opacity-0")}>
        <motion.div style={{ y: reduce ? 0 : contentY, opacity: fade }} className="max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.4, ease }}
            className="mb-7 inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-brand-yellow sm:text-xs"
          >
            <span className="h-px w-10 bg-brand-yellow" aria-hidden />
            Interior Design · Architecture · Bangladesh
          </motion.p>

          <h1 className="font-serif text-[clamp(2.9rem,9vw,7rem)] font-semibold leading-[0.96] tracking-tight">
            <span className="block overflow-hidden pb-2">
              <motion.span
                className="block"
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1, delay: 2.5, ease }}
              >
                Art Meets
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-3">
              <motion.span
                className="relative block text-brand-yellow"
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1, delay: 2.65, ease }}
              >
                Architecture
              </motion.span>
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 2.95, ease }}
            className="mt-7 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg"
          >
            We design, build and furnish homes, workplaces and hospitality spaces across Bangladesh — precise in plan,
            expressive in detail, delivered on time.
          </motion.p>
        </motion.div>
      </Container>

      {/* Image phase: the caption sits exactly where the "Art Meets Architecture" title does */}
      {cycling && (
        <div
          className={cn(
            "absolute inset-0 z-10 flex items-center transition-opacity duration-[1400ms]",
            showingImage ? "opacity-100" : "pointer-events-none opacity-0",
          )}
          aria-live="polite"
        >
          <Container className="pb-24 pt-36">
            <div className="max-w-3xl">
              {slides[phase]?.caption && (
                <>
                  <p className="mb-7 inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-brand-yellow sm:text-xs">
                    <span className="h-px w-10 bg-brand-yellow" aria-hidden />
                    Interior Design · Architecture · Bangladesh
                  </p>
                  <motion.h2
                    key={phase}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.3, ease }}
                    className="line-clamp-4 font-serif text-[clamp(2.4rem,7.5vw,6rem)] font-semibold leading-[1.02] tracking-tight text-white"
                  >
                    {slides[phase].caption}
                  </motion.h2>
                </>
              )}
            </div>
          </Container>
        </div>
      )}

      {/* Progress dots (image phase) */}
      {cycling && (
        <div className={cn("absolute inset-x-0 bottom-10 z-10 transition-opacity duration-[1400ms]", showingImage ? "opacity-100" : "pointer-events-none opacity-0")}>
          <Container>
            <div className="flex gap-2" role="tablist" aria-label="Hero images">
              {slides.map((slide, i) => (
                <button
                  key={slide.id}
                  type="button"
                  role="tab"
                  aria-selected={i === phase}
                  aria-label={`Show image ${i + 1}`}
                  onClick={() => setPhase(i)}
                  className={cn("h-1 w-10 transition-colors", i === phase ? "bg-brand-yellow" : "bg-white/40 hover:bg-white/70")}
                />
              ))}
            </div>
          </Container>
        </div>
      )}

      <motion.a
        href="#intro"
        aria-label="Scroll to content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.6 }}
        className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-white/60 hover:text-brand-yellow sm:flex"
      >
        Scroll
        <ChevronDown size={18} className="animate-bounce" />
      </motion.a>
    </section>
  );
}
