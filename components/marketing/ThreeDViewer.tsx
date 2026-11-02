"use client";

import { Box, Loader2, Maximize2, Play } from "lucide-react";
import { createElement, useEffect, useRef, useState } from "react";

/**
 * Landscape (16:9) media player used for both tabs.
 *  • .glb / .gltf  → interactive 3D model, loaded automatically once it scrolls into view
 *  • .mp4/.webm/.mov or an embed link (Sketchfab, YouTube, Matterport…) → click-to-play, so nothing heavy loads on first paint
 */
export function ThreeDViewer({ src, mode = "3d" }: { src: string; mode?: "3d" | "video" }) {
  const [active, setActive] = useState(false);
  const isModel = /\.(glb|gltf)(\?|$)/i.test(src);
  const isVideoFile = /\.(mp4|webm|mov)(\?|$)/i.test(src);
  const embed = toEmbedUrl(src);
  const label = mode === "video" ? "Play video" : "Launch 3D view";

  if (isModel)
    return (
      <div className="relative aspect-video w-full overflow-hidden border border-white/15 bg-charcoal-deep">
        <GlbViewer src={src} />
      </div>
    );

  return (
    <div className="relative aspect-video w-full overflow-hidden border border-white/15 bg-charcoal-deep">
      {active ? (
        isVideoFile ? (
          <video src={src} controls autoPlay playsInline className="h-full w-full object-cover" />
        ) : (
          <iframe
            src={embed}
            title={mode === "video" ? "ARCHIARTIX walkthrough video" : "3D view of an ARCHIARTIX space"}
            allow="fullscreen; xr-spatial-tracking; accelerometer; gyroscope; autoplay"
            allowFullScreen
            className="h-full w-full border-0"
          />
        )
      ) : (
        <button
          type="button"
          onClick={() => setActive(true)}
          aria-label={label}
          className="group absolute inset-0 grid place-items-center overflow-hidden"
        >
          <svg className="absolute inset-0 h-full w-full opacity-60" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" fill="none" aria-hidden>
            <path d="M200 40 L340 110 L340 220 L200 290 L60 220 L60 110 Z" stroke="#FADF0B" strokeWidth="1.5" />
            <path d="M200 40 L200 150 M60 110 L200 150 L340 110" stroke="#fff" strokeOpacity=".35" strokeWidth="1" />
            <path d="M200 150 L200 290" stroke="#fff" strokeOpacity=".35" strokeWidth="1" />
            <path d="M130 75 L130 185 M270 75 L270 185" stroke="#fff" strokeOpacity=".15" strokeWidth="1" />
          </svg>
          <span className="relative flex flex-col items-center gap-3">
            <span className="grid h-20 w-20 place-items-center rounded-full bg-brand-yellow text-ink shadow-[0_0_0_10px_rgba(250,223,11,.18)] transition-transform duration-300 group-hover:scale-110">
              <Play size={30} className="ml-1" fill="currentColor" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white">{label}</span>
          </span>
          <Maximize2 size={16} className="absolute bottom-3 right-3 text-white/50" aria-hidden />
        </button>
      )}
    </div>
  );
}

/** Loads Google's <model-viewer> only when the viewer is near the screen, then shows the model with orbit controls. */
export function GlbViewer({ src }: { src: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        import("@google/model-viewer").then(() => setReady(true)).catch(() => setFailed(true));
      },
      { rootMargin: "300px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={box} className="absolute inset-0">
      {ready &&
        createElement("model-viewer", {
          src,
          alt: "Interactive 3D model of an ARCHIARTIX space",
          "camera-controls": "",
          "auto-rotate": "",
          "shadow-intensity": "1",
          "environment-image": "neutral",
          "interaction-prompt": "auto",
          style: { width: "100%", height: "100%", "--poster-color": "transparent" },
        })}
      {!ready && !failed && (
        <span className="absolute inset-0 grid place-items-center text-white/70">
          <Loader2 className="animate-spin" size={28} />
        </span>
      )}
      {failed && <span className="absolute inset-0 grid place-items-center text-sm text-white/70">Couldn’t load the 3D model.</span>}
      {ready && (
        <span className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 bg-ink/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/80">
          Drag to rotate · scroll to zoom
        </span>
      )}
    </div>
  );
}

export function ThreeDPlaceholder() {
  return (
    <div className="relative grid aspect-video w-full place-items-center border border-dashed border-white/25 bg-white/[0.03] text-center">
      <div className="space-y-3 px-6">
        <Box size={40} className="mx-auto text-brand-yellow" />
        <p className="text-sm font-semibold uppercase tracking-[0.16em]">3D view coming soon</p>
        <p className="text-xs text-white/60">Set NEXT_PUBLIC_3D_VIEW_URL (3D) or NEXT_PUBLIC_VIDEO_URL (video) in .env.local.</p>
      </div>
    </div>
  );
}

/** YouTube / Vimeo watch links → embeddable URLs; anything else is used as-is. */
function toEmbedUrl(src: string) {
  try {
    const u = new URL(src);
    const host = u.hostname.replace(/^www\./, "");
    if (host === "youtu.be") return `https://www.youtube.com/embed/${u.pathname.slice(1)}?autoplay=1&rel=0`;
    if (host === "youtube.com" && u.pathname === "/watch" && u.searchParams.get("v"))
      return `https://www.youtube.com/embed/${u.searchParams.get("v")}?autoplay=1&rel=0`;
    if (host === "vimeo.com" && /^\/\d+/.test(u.pathname)) return `https://player.vimeo.com/video/${u.pathname.slice(1)}?autoplay=1`;
  } catch {
    /* not a URL we can parse — use it as given */
  }
  return src;
}
