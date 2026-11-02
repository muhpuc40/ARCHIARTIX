import { Container } from "@/components/ui/Container";
import { CountUp } from "@/components/ui/CountUp";
import { Stagger, StaggerItem } from "@/components/ui/Reveal";
import { stats } from "@/lib/content";

export function StatsBand() {
  return (
    <section aria-label="ARCHIARTIX in numbers" className="diag-top relative -mt-10 bg-brand-yellow pb-16 pt-24 text-ink">
      <Container>
        <Stagger className="grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4">
          {stats.map((s) => (
            <StaggerItem key={s.label} className="border-l-2 border-ink/80 pl-5">
              <p className="font-serif text-5xl font-bold leading-none sm:text-6xl">
                <CountUp value={s.value} suffix={s.suffix} />
              </p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-ink/75">{s.label}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
