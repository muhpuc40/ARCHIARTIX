import { ServiceCard } from "@/components/marketing/ServiceCard";
import { Container } from "@/components/ui/Container";
import { Stagger, StaggerItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getServices } from "@/lib/data";

export async function ServicesPreview() {
  const services = await getServices();
  return (
    <section className="blueprint-bg relative overflow-hidden bg-ink py-16 sm:py-24">
      <Container className="relative">
        <SectionHeading
          tone="dark"
          eyebrow="What we do"
          title="One studio. Design to handover."
          text="Pick a single service or let us take the whole project from first sketch to finished space."
        />
        <Stagger className="mt-10 grid gap-6 lg:grid-cols-3">
          {services.map((s) => (
            <StaggerItem key={s.id}>
              <ServiceCard service={s} />
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
