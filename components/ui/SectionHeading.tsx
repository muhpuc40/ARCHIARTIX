import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/Reveal";

export function SectionHeading({
  eyebrow,
  title,
  text,
  align = "left",
  tone = "light",
  className,
  as: Tag = "h2",
}: {
  eyebrow?: string;
  title: React.ReactNode;
  text?: React.ReactNode;
  align?: "left" | "center";
  tone?: "light" | "dark";
  className?: string;
  as?: "h1" | "h2" | "h3";
}) {
  const dark = tone === "dark";
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && (
        <Reveal>
          <p
            className={cn(
              "mb-4 inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em]",
              dark ? "text-brand-yellow" : "text-neutral-600",
            )}
          >
            <span className="h-px w-8 bg-brand-yellow" aria-hidden />
            {eyebrow}
            {align === "center" && <span className="h-px w-8 bg-brand-yellow" aria-hidden />}
          </p>
        </Reveal>
      )}
      <Reveal delay={0.05}>
        <Tag className={cn("text-3xl leading-[1.12] sm:text-4xl lg:text-5xl", dark ? "text-white" : "text-ink")}>
          {title}
        </Tag>
      </Reveal>
      {text && (
        <Reveal delay={0.12}>
          <p className={cn("mt-5 text-base leading-relaxed sm:text-lg", dark ? "text-white/70" : "text-neutral-600")}>
            {text}
          </p>
        </Reveal>
      )}
    </div>
  );
}
