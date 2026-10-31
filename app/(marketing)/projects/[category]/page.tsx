import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CTABand } from "@/components/marketing/CTABand";
import { PageHeader } from "@/components/marketing/PageHeader";
import { ProjectFilters } from "@/components/marketing/ProjectFilters";
import { ProjectGrid } from "@/components/marketing/ProjectGrid";
import { getCategories, getProjectsByCategory } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ category: string }> };

const blurbs: Record<string, string> = {
  residential:
    "Apartments, duplexes and villas shaped around the way families really live.",
  commercial:
    "Offices, retail and co-working spaces that look sharp and work hard.",
  hospitality:
    "Hotels, restaurants and resorts designed to make guests linger.",
};

export async function generateStaticParams() {
  return (await getCategories("project")).map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const cat = (await getCategories("project")).find((c) => c.slug === category);
  if (!cat) return {};
  return pageMetadata({
    title: `${cat.name} Interior & Architecture Projects`,
    description: `${blurbs[cat.slug] ?? `${cat.name} projects by ARCHIARTIX.`} Browse our ${cat.name.toLowerCase()} work across Bangladesh.`,
    path: `/projects/${cat.slug}`,
  });
}

export default async function ProjectCategoryPage({ params }: Props) {
  const { category } = await params;
  const cat = (await getCategories("project")).find((c) => c.slug === category);
  if (!cat) notFound();
  const projects = await getProjectsByCategory(cat.slug);

  return (
    <>
      <PageHeader
        eyebrow="Portfolio"
        title={`${cat.name} projects`}
        text={
          blurbs[cat.slug] ??
          `A selection of our ${cat.name.toLowerCase()} work.`
        }
        crumbs={[
          { name: "Projects", href: "/projects" },
          { name: cat.name, href: `/projects/${cat.slug}` },
        ]}>
        <ProjectFilters active={cat.slug} />
      </PageHeader>
      <ProjectGrid projects={projects} />
      <CTABand />
    </>
  );
}
