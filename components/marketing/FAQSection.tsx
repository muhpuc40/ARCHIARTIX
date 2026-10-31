import { Accordion } from "@/components/ui/Accordion";
import { Container } from "@/components/ui/Container";
import { JsonLd } from "@/components/ui/JsonLd";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { faqs } from "@/lib/content";

export function FAQSection() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <section className="bg-brand-cream py-24 sm:py-32">
      <Container className="grid gap-14 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionHeading eyebrow="FAQ" title="Questions, answered" text="Can’t find what you’re looking for? Talk to us — we reply within one working day." />
          <Reveal delay={0.15} className="mt-8">
            <ButtonLink href="/contact" variant="dark">
              Ask a question
            </ButtonLink>
          </Reveal>
        </div>
        <Reveal>
          <Accordion items={faqs} />
        </Reveal>
      </Container>
      <JsonLd data={jsonLd} />
    </section>
  );
}
