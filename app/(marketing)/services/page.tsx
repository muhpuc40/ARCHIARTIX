import { CTABand } from "@/components/marketing/CTABand";
import { FAQSection } from "@/components/marketing/FAQSection";
import { PageHeader } from "@/components/marketing/PageHeader";
import { ProcessTimeline } from "@/components/marketing/ProcessTimeline";
import { ServiceCard } from "@/components/marketing/ServiceCard";
import { Container } from "@/components/ui/Container";
import { Stagger, StaggerItem } from "@/components/ui/Reveal";
import { getServices } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Services — Interior, Architectural & Turnkey",
  description:
    "Interior design, architectural design and turnkey execution across Bangladesh. One accountable team from concept to handover, with transparent budgets and 3D visuals.",
  path: "/services",
});

export default async function ServicesPage() {
  const services = await getServices();
  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="Everything between a sketch and a finished space"
        text="Choose one service or the whole journey. Every engagement starts with a clear scope and a fixed design fee."
        crumbs={[{ name: "Services", href: "/services" }]}
      />
      <section className="py-16 sm:py-24">
        <Container>
          <Stagger className="grid gap-6 lg:grid-cols-3">
            {services.map((s, i) => (
              <StaggerItem key={s.id}>
                <ServiceCard service={s} index={i} />
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>
      <ProcessTimeline />
      <FAQSection />
      <CTABand />
    </>
  );
}
