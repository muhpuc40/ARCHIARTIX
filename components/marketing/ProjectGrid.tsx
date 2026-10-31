import { ProjectCard } from "@/components/marketing/ProjectCard";
import { Container } from "@/components/ui/Container";
import { Stagger, StaggerItem } from "@/components/ui/Reveal";
import type { Project } from "@/lib/types";

export function ProjectGrid({ projects }: { projects: Project[] }) {
  return (
    <section className="py-16 sm:py-24">
      <Container>
        {projects.length === 0 ? (
          <p className="py-20 text-center text-neutral-600">New projects are on the way — check back soon.</p>
        ) : (
          <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p, i) => (
              <StaggerItem key={p.id}>
                <ProjectCard project={p} priority={i < 3} />
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </Container>
    </section>
  );
}
