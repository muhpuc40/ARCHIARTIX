import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { processSteps } from "@/lib/content";

export function ProcessTimeline() {
  return (
    <section className="py-24 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow="How we work"
          title="A clear process, from first call to final handover"
          text="Five stages, each with defined deliverables — so you always know what happens next."
        />
        <ol className="relative mt-16 grid gap-10 lg:grid-cols-5 lg:gap-6">
          <span
            className="absolute left-[19px] top-2 hidden h-[calc(100%-1rem)] w-px bg-line max-lg:block lg:left-0 lg:top-[19px] lg:h-px lg:w-full"
            aria-hidden
          />
          {processSteps.map((step, i) => (
            <li key={step.title} className="relative pl-14 lg:pl-0 lg:pt-14">
              <Reveal delay={i * 0.08}>
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
