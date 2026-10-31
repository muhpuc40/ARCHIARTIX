import { ArrowUpRight, Hammer, PenTool, Sofa } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Service } from "@/lib/types";

const icons: Record<string, React.ComponentType<{ size?: number }>> = {
  "interior-design": Sofa,
  "architectural-design": PenTool,
  "turnkey-execution": Hammer,
};

export function ServiceCard({ service, index, dark = false }: { service: Service; index: number; dark?: boolean }) {
  const Icon = icons[service.slug] ?? PenTool;
  return (
    <Link
      href={`/services/${service.slug}`}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden border p-8 transition-all duration-500 sm:p-10",
        dark
          ? "border-white/15 bg-white/[0.03] text-white hover:border-brand-yellow hover:bg-brand-yellow hover:text-ink"
          : "border-line bg-white hover:border-brand-yellow hover:bg-brand-yellow",
      )}
    >
      <span
        className={cn(
          "absolute right-6 top-4 font-serif text-7xl font-bold leading-none opacity-10 transition-opacity group-hover:opacity-20",
        )}
        aria-hidden
      >
        0{index + 1}
      </span>
      <span
        className={cn(
          "grid h-14 w-14 place-items-center transition-colors",
          dark ? "bg-brand-yellow text-ink group-hover:bg-ink group-hover:text-brand-yellow" : "bg-ink text-brand-yellow group-hover:bg-ink",
        )}
      >
        <Icon size={26} />
      </span>
      <h3 className="mt-8 font-serif text-2xl sm:text-3xl">{service.title}</h3>
      <p className={cn("mt-4 flex-1 text-sm leading-relaxed sm:text-base", dark ? "text-white/65 group-hover:text-ink/80" : "text-neutral-600 group-hover:text-ink/80")}>
        {service.summary}
      </p>
      <span className="mt-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em]">
        Learn more
        <ArrowUpRight size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
