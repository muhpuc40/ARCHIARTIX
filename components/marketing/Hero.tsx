"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

type NavigatorWithConnection = Navigator & { connection?: { saveData?: boolean } };

/**
 * Home hero. Layer order (back → front):
 *   animated blueprint art  →  background video (deferred, optional)  →  overlay  →  content
 * The video only starts loading once the browser is idle, never on reduced-motion
 * or data-saver connections, and fades in only if NEXT_PUBLIC_HERO_VIDEO_URL (a Cloudinary video URL) is set.
 */
export function Hero() {
  const reduce = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [videoReady, setVideoReady] = useState(false);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const markY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || reduce) return;
    if ((navigator as NavigatorWithConnection).connection?.saveData) return;

    const src = process.env.NEXT_PUBLIC_HERO_VIDEO_URL;
    if (!src) return;
    const start = () => {
      video.src = src;
      video.load();
      video.play().catch(() => undefined);
    };
    let idleId: number | undefined;
    let timeoutId: number | undefined;
    const w = window as Window & { requestIdleCallback?: typeof window.requestIdleCallback };
    if (typeof w.requestIdleCallback === "function") idleId = w.requestIdleCallback(start, { timeout: 3000 });
    else timeoutId = window.setTimeout(start, 1500);

    return () => {
      if (idleId !== undefined) w.cancelIdleCallback?.(idleId);
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, [reduce]);

  return (
    <section ref={sectionRef} className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-ink text-white">
      {/* 1 — animated blueprint art (also the poster until/unless the video plays) */}
      <div className="blueprint-bg absolute inset-0" aria-hidden />
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
      <div className="absolute -right-40 top-1/4 h-[620px] w-[620px] rounded-full bg-brand-yellow/10 blur-[120px]" aria-hidden />

      {/* 2 — background video (deferred; optional) */}
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload="none"
        aria-hidden
        tabIndex={-1}
        onCanPlay={() => setVideoReady(true)}
        onError={() => setVideoReady(false)}
        className={cn(
          "absolute inset-0 h-full w-full object-cover transition-opacity duration-[1400ms]",
          videoReady ? "opacity-50" : "opacity-0",
        )}
      />

      {/* 3 — overlay for legibility */}
      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/70 to-ink/20" aria-hidden />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent" aria-hidden />

      {/* The "A" mark, floating on the right */}
      <motion.div
        style={{ y: reduce ? 0 : markY, opacity: fade }}
        className="pointer-events-none absolute right-[4%] top-1/2 hidden -translate-y-1/2 lg:block"
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
      <Container className="relative z-10 pb-24 pt-36">
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 3.1, ease }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <ButtonLink href="/contact?type=quote#quote" size="lg">
              Start your project <ArrowRight size={18} className="transition-transform group-hover/btn:translate-x-1" />
            </ButtonLink>
            <ButtonLink href="/projects" size="lg" variant="outline-light">
              Explore projects
            </ButtonLink>
          </motion.div>
        </motion.div>
      </Container>

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
