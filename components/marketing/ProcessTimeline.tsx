import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { processSteps } from "@/lib/content";

export function ProcessTimeline() {
  return (
    <section className="py-20 sm:py-28 lg:py-32">
      <Container>
        <SectionHeading
          eyebrow="How we work"
          title="A clear process, from first call to final handover"
          text="Five stages, each with defined deliverables — so you always know what happens next."
        />
        <ol className="relative mt-12 grid gap-8 sm:mt-16 lg:grid-cols-5 lg:gap-6">
          <span
            className="absolute left-[19px] top-2 h-[calc(100%-1rem)] w-px bg-line lg:left-0 lg:top-[19px] lg:h-px lg:w-full"
            aria-hidden
          />
          {processSteps.map((step, i) => (
            <li key={step.title} className="list-none">
              {/* The whole step (badge + text) is one block that fades up together — the badge is positioned
                  inside this block, so it can never slide in separately from the text. */}
              <Reveal delay={i * 0.07} distance={20} duration={0.6} className="relative pl-14 lg:pl-0 lg:pt-14">
                <span className="absolute left-0 top-0 grid h-10 w-10 place-items-center border-2 border-ink bg-brand-yellow font-serif text-lg font-bold">
                  {i + 1}
                </span>
                <h3 className="font-sans text-base font-bold uppercase tracking-[0.1em]">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-neutral-600">{step.text}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
