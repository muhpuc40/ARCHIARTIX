import Link from "next/link";
import { cn } from "@/lib/utils";

const chips = [
  { label: "All", href: "/projects", slug: "" },
  { label: "Residential", href: "/projects/residential", slug: "residential" },
  { label: "Commercial", href: "/projects/commercial", slug: "commercial" },
  { label: "Hospitality", href: "/projects/hospitality", slug: "hospitality" },
];

export function ProjectFilters({ active = "" }: { active?: string }) {
  return (
    <nav aria-label="Project categories" className="flex flex-wrap gap-3">
      {chips.map((c) => (
        <Link
          key={c.slug}
          href={c.href}
          aria-current={c.slug === active ? "page" : undefined}
          className={cn(
            "border px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] transition-colors",
            c.slug === active
              ? "border-brand-yellow bg-brand-yellow text-ink"
              : "border-white/30 text-white hover:border-brand-yellow hover:text-brand-yellow",
          )}
        >
          {c.label}
        </Link>
      ))}
    </nav>
  );
}
