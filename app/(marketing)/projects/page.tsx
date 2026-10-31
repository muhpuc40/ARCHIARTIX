import { CTABand } from "@/components/marketing/CTABand";
import { PageHeader } from "@/components/marketing/PageHeader";
import { ProjectFilters } from "@/components/marketing/ProjectFilters";
import { ProjectGrid } from "@/components/marketing/ProjectGrid";
import { getProjects } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Projects — Residential, Commercial & Hospitality",
  description:
    "Explore ARCHIARTIX interior and architecture projects across Bangladesh: homes, offices, retail and hospitality spaces designed and delivered end to end.",
  path: "/projects",
});

export default async function ProjectsPage() {
  const projects = await getProjects();
  return (
    <>
      <PageHeader
        eyebrow="Portfolio"
        title="Projects that balance art and architecture"
        text="Homes, workplaces and hospitality spaces — each designed around the people who use them."
        crumbs={[{ name: "Projects", href: "/projects" }]}>
        <ProjectFilters />
      </PageHeader>
      <ProjectGrid projects={projects} />
      <CTABand />
    </>
  );
}
