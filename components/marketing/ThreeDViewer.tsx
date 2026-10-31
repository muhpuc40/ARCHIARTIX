"use client";

import { Box, Maximize2, Play } from "lucide-react";
import { useState } from "react";

/** Click-to-load 3D/360° viewer. The iframe is only created after a click, so it costs nothing on first paint. */
export function ThreeDViewer({ src }: { src: string }) {
  const [active, setActive] = useState(false);
  const isVideoFile = /\.(mp4|webm|mov)(\?|$)/i.test(src);

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden border border-white/15 bg-charcoal-deep sm:aspect-video lg:aspect-[4/3]">
      {active ? (
        isVideoFile ? (
          <video src={src} controls autoPlay playsInline className="h-full w-full object-cover" />
        ) : (
          <iframe
            src={src}
            title="3D view of an ARCHIAETIX space"
            allow="fullscreen; xr-spatial-tracking; accelerometer; gyroscope; autoplay"
            allowFullScreen
            className="h-full w-full border-0"
          />
        )
      ) : (
        <button
          type="button"
          onClick={() => setActive(true)}
          aria-label="Launch the interactive 3D view"
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
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white">Launch 3D view</span>
          </span>
          <Maximize2 size={16} className="absolute bottom-3 right-3 text-white/50" aria-hidden />
        </button>
      )}
    </div>
  );
}

export function ThreeDPlaceholder() {
  return (
    <div className="relative grid aspect-[4/3] w-full place-items-center border border-dashed border-white/25 bg-white/[0.03] text-center sm:aspect-video lg:aspect-[4/3]">
      <div className="space-y-3 px-6">
        <Box size={40} className="mx-auto text-brand-yellow" />
        <p className="text-sm font-semibold uppercase tracking-[0.16em]">3D view coming soon</p>
        <p className="text-xs text-white/60">Set NEXT_PUBLIC_3D_VIEW_URL in .env.local to show your 3D tour here.</p>
      </div>
    </div>
  );
}
