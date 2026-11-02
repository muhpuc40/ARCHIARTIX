import { ArrowRight, Check } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PlaceholderArt } from "@/components/ui/PlaceholderArt";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function AboutIntro() {
  return (
    <section id="intro" className="scroll-mt-24 py-24 sm:py-32">
      <Container className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <div>
          <SectionHeading
            eyebrow="Who we are"
            title={
              <>
                Where <span className="italic text-charcoal">art</span> meets the discipline of{" "}
                <span className="underline decoration-brand-yellow decoration-4 underline-offset-8">architecture</span>
              </>
            }
          />
          <Reveal delay={0.1}>
            <p className="mt-7 text-base leading-relaxed text-neutral-600 sm:text-lg">
              ARCHIARTIX is a studio of architects, interior designers and site engineers. We believe a building is a
              canvas for light, texture and proportion — and an interior is where that art meets daily life.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <ul className="mt-8 grid gap-3 text-sm font-medium sm:grid-cols-2">
              {["Design, build and furnish — one team", "Transparent budgets, priced drawings", "3D & VR walkthroughs before construction", "Daily site supervision, weekly reports"].map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-yellow">
                    <Check size={13} strokeWidth={3} />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.2} className="mt-10">
            <ButtonLink href="/about" variant="dark">
              Our story <ArrowRight size={16} />
            </ButtonLink>
          </Reveal>
        </div>

        <Reveal direction="left" className="relative">
          <div className="relative aspect-[4/5] overflow-hidden bg-ink shadow-2xl">
            <PlaceholderArt seed="about-intro" tone="dark" />
          </div>
          <div className="absolute -bottom-6 -left-4 hidden bg-brand-yellow p-6 shadow-xl sm:block">
            <p className="font-serif text-4xl font-bold leading-none">10+</p>
            <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.18em]">Years of practice</p>
          </div>
          <div className="absolute -right-3 -top-3 h-24 w-24 border-r-4 border-t-4 border-brand-yellow" aria-hidden />
        </Reveal>
      </Container>
    </section>
  );
}
