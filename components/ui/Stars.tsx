import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

/** 5-star rating that supports half stars (e.g. 3.5). Colour comes from the surrounding text colour. */
export function Stars({ value, size = 16, className }: { value: number; size?: number; className?: string }) {
  const v = Math.max(0, Math.min(5, value));
  return (
    <span role="img" aria-label={`${v} out of 5 stars`} className={cn("inline-flex gap-0.5", className)}>
      {Array.from({ length: 5 }).map((_, i) => {
        const fill = Math.max(0, Math.min(1, v - i));
        return (
          <span key={i} className="relative inline-block" style={{ width: size, height: size }} aria-hidden>
            <Star size={size} strokeWidth={1.6} className="absolute inset-0 opacity-35" />
            {fill > 0 && (
              <span className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
                <Star size={size} strokeWidth={1.6} fill="currentColor" />
              </span>
            )}
          </span>
        );
      })}
    </span>
  );
}
