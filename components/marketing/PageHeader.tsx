import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { JsonLd } from "@/components/ui/JsonLd";
import { Reveal } from "@/components/ui/Reveal";
import { absoluteUrl } from "@/lib/site";
import { cn } from "@/lib/utils";

export type Crumb = { name: string; href: string };

/** Dark banner used at the top of every inner page. Emits BreadcrumbList JSON-LD. */
export function PageHeader({
  eyebrow,
  title,
  text,
  crumbs = [],
  className,
  compact = false,
  children,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  text?: React.ReactNode;
  crumbs?: Crumb[];
  className?: string;
  compact?: boolean;
  children?: React.ReactNode;
}) {
  const all: Crumb[] = [{ name: "Home", href: "/" }, ...crumbs];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: all.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.href),
    })),
  };

  return (
    <section className={cn(
        "blueprint-bg relative overflow-hidden bg-ink text-white",
        compact ? "pb-10 pt-32 sm:pb-12 sm:pt-36" : "pb-16 pt-36 sm:pb-20 sm:pt-44",
        className,
      )}>
      <svg
        className="draw-line pointer-events-none absolute -right-10 top-0 h-full w-[60%] min-w-[420px] opacity-70"
        viewBox="0 0 600 400"
        preserveAspectRatio="xMaxYMid slice"
        fill="none"
        aria-hidden
      >
        <path d="M330 -10 L560 410" stroke="#FADF0B" strokeWidth="3" style={{ ["--len" as string]: 520 }} />
        <path d="M180 410 L330 140 L400 270" stroke="rgba(255,255,255,.35)" strokeWidth="2" className="delay-1" style={{ ["--len" as string]: 520 }} />
        <path d="M120 300 H520" stroke="#FADF0B" strokeWidth="2" className="delay-2" style={{ ["--len" as string]: 420 }} />
      </svg>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-transparent" aria-hidden />

      <Container className="relative">
        {all.length > 1 && (
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.16em] text-white/60">
              {all.map((c, i) => (
                <li key={c.href + i} className="flex items-center gap-2">
                  {i > 0 && <span aria-hidden className="text-brand-yellow">/</span>}
                  {i < all.length - 1 ? (
                    <Link href={c.href} className="hover:text-brand-yellow">
                      {c.name}
                    </Link>
                  ) : (
                    <span aria-current="page" className="text-white">
                      {c.name}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
        {eyebrow && (
          <Reveal>
            <p className="mb-5 inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-yellow">
              <span className="h-px w-10 bg-brand-yellow" aria-hidden /> {eyebrow}
            </p>
          </Reveal>
        )}
        <Reveal delay={0.05}>
          <h1 className="max-w-3xl text-4xl leading-[1.05] sm:text-5xl lg:text-6xl">{title}</h1>
        </Reveal>
        {text && (
          <Reveal delay={0.12}>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">{text}</p>
          </Reveal>
        )}
        {children && <Reveal delay={0.2} className="mt-8">{children}</Reveal>}
      </Container>
      <JsonLd data={jsonLd} />
    </section>
  );
}
