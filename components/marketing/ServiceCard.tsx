import { ArrowUpRight, Hammer, PenTool, Sofa } from "lucide-react";
import Link from "next/link";
import type { Service } from "@/lib/types";

const icons: Record<string, React.ComponentType<{ size?: number }>> = {
  "interior-design": Sofa,
  "architectural-design": PenTool,
  "turnkey-execution": Hammer,
};

/**
 * Background photo for each service lives in /public/design/<slug>.(webp|jpg|jpeg|png), e.g.
 * public/design/interior-design.jpg. Several formats are layered so whichever file exists is shown; if none exists
 * the card falls back to the dark charcoal background.
 */
function backgroundFor(slug: string) {
  return ["webp", "jpg", "jpeg", "png"].map((ext) => `url("/design/${slug}.${ext}")`).join(", ");
}

export function ServiceCard({ service }: { service: Service }) {
  const Icon = icons[service.slug] ?? PenTool;
  return (
    <Link
      href={`/services/${service.slug}`}
      className="group relative isolate flex h-full min-h-[420px] flex-col overflow-hidden border border-white/15 bg-charcoal-deep p-8 text-white transition-colors duration-500 hover:border-brand-yellow sm:min-h-[460px] sm:p-10"
    >
      {/* Photo: slow zoom-in on hover, eases back out when the pointer leaves */}
      <span
        aria-hidden
        className="absolute inset-0 -z-20 scale-100 bg-cover bg-center transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform group-hover:scale-110 group-focus-visible:scale-110"
        style={{ backgroundImage: backgroundFor(service.slug) }}
      />
      {/* Shade so the text stays readable on any photo */}
      <span
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/95 via-ink/60 to-ink/25 transition-opacity duration-500 group-hover:opacity-90"
      />

      <span className="grid h-14 w-14 place-items-center bg-brand-yellow text-ink">
        <Icon size={26} />
      </span>
      <div className="mt-auto pt-16">
        <h3 className="font-serif text-2xl sm:text-3xl">{service.title}</h3>
        <p className="mt-4 text-sm leading-relaxed text-white/75 sm:text-base">{service.summary}</p>
        <span className="mt-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-brand-yellow">
          Learn more
          <ArrowUpRight size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
