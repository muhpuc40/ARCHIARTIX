"use client";

import { Box, Clapperboard } from "lucide-react";
import { useState } from "react";
import { ThreeDPlaceholder, ThreeDViewer } from "@/components/marketing/ThreeDViewer";
import { cn } from "@/lib/utils";

/** Video | 3D switch for the "Walk through your space" section. Each viewer loads only after its play click. */
export function WalkthroughMedia({ videoUrl, tour3dUrl }: { videoUrl: string; tour3dUrl: string }) {
  const tabs = [
    tour3dUrl && { id: "3d" as const, label: "3D", Icon: Box },
    videoUrl && { id: "video" as const, label: "Video", Icon: Clapperboard },
  ].filter(Boolean) as { id: "3d" | "video"; label: string; Icon: typeof Box }[];
  const [tab, setTab] = useState<"3d" | "video">(tabs[0]?.id ?? "3d");

  if (tabs.length === 0) return <ThreeDPlaceholder />;

  return (
    <div className="space-y-3">
      {tabs.length > 1 && (
        <div role="tablist" aria-label="Walkthrough media" className="inline-flex border border-white/20 p-1">
          {tabs.map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={tab === id}
              onClick={() => setTab(id)}
              className={cn(
                "inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold uppercase tracking-[0.16em] transition-colors",
                tab === id ? "bg-brand-yellow text-ink" : "text-white/70 hover:text-white",
              )}
            >
              <Icon size={15} /> {label}
            </button>
          ))}
        </div>
      )}
      {/* key remounts the viewer on tab change, which also stops a playing video */}
      {tab === "3d" ? <ThreeDViewer key="3d" src={tour3dUrl} mode="3d" /> : <ThreeDViewer key="video" src={videoUrl} mode="video" />}
    </div>
  );
}
