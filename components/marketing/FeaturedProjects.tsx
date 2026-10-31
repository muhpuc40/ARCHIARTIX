import { ArrowRight } from "lucide-react";
import { ProjectCard } from "@/components/marketing/ProjectCard";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Stagger, StaggerItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getFeaturedProjects } from "@/lib/data";

export async function FeaturedProjects() {
  const projects = await getFeaturedProjects(6);
  return (
    <section className="bg-brand-cream py-24 sm:py-32">
      <Container>
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading eyebrow="Selected work" title="Spaces we’re proud of" text="From family homes to boutique hotels — a look at recent residential, commercial and hospitality projects." />
          <ButtonLink href="/projects" variant="dark" className="self-start lg:self-auto">
            All projects <ArrowRight size={16} />
          </ButtonLink>
        </div>
        <Stagger className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <StaggerItem key={p.id} className={i % 3 === 1 ? "lg:mt-12" : ""}>
              <ProjectCard project={p} />
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
