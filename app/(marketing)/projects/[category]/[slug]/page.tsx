import { ArrowLeft, ArrowRight, Calendar, Layers, MapPin, Ruler } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CTABand } from "@/components/marketing/CTABand";
import { PageHeader } from "@/components/marketing/PageHeader";
import { projectHref } from "@/components/marketing/ProjectCard";
import { Container } from "@/components/ui/Container";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { SmartImage } from "@/components/ui/SmartImage";
import { getProjectBySlug, getProjects } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ category: string; slug: string }> };

export async function generateStaticParams() {
  return (await getProjects())
    .filter((p) => p.category?.slug)
    .map((p) => ({ category: p.category!.slug, slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project || project.category?.slug !== category) return {};
  return pageMetadata({
    title: `${project.title} — ${project.category?.name ?? "Project"}`,
    description: project.description.slice(0, 158),
    path: projectHref(project),
    image: project.cover_image_url ?? undefined,
  });
}

export default async function ProjectDetailPage({ params }: Props) {
  const { category, slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project || project.category?.slug !== category) notFound();

  const all = await getProjects();
  const idx = all.findIndex((p) => p.id === project.id);
  const prev = all[(idx - 1 + all.length) % all.length]!;
  const next = all[(idx + 1) % all.length]!;

  const facts = [
    { Icon: MapPin, label: "Location", value: project.location },
    { Icon: Calendar, label: "Year", value: project.year },
    { Icon: Ruler, label: "Area", value: project.area_sqft ? `${project.area_sqft.toLocaleString("en-US")} sq ft` : null },
    { Icon: Layers, label: "Category", value: project.category?.name },
  ].filter((f) => f.value);

  const gallery = project.images.length > 0 ? project.images : [null, null, null];

  return (
    <>
      <PageHeader
        eyebrow={project.category?.name}
        title={project.title}
        crumbs={[
          { name: "Projects", href: "/projects" },
          ...(project.category ? [{ name: project.category.name, href: `/projects/${project.category.slug}` }] : []),
          { name: project.title, href: projectHref(project) },
        ]}
      />

      <section className="py-16 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-[1.6fr_1fr] lg:gap-16">
          <Reveal>
            <div className="relative aspect-[16/10] overflow-hidden bg-ink">
              <SmartImage src={project.cover_image_url} alt={project.title} seed={project.slug} priority sizes="(min-width:1024px) 60vw, 100vw" />
            </div>
            <p className="mt-10 text-lg leading-relaxed text-neutral-700">{project.description}</p>
          </Reveal>
          <Reveal delay={0.1} direction="left">
            <aside className="border-t-4 border-brand-yellow bg-brand-cream p-8">
              <h2 className="font-sans text-xs font-bold uppercase tracking-[0.24em]">Project facts</h2>
              <dl className="mt-6 divide-y divide-line">
                {facts.map(({ Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-4 py-4">
                    <Icon size={20} className="shrink-0" />
                    <div>
                      <dt className="text-[11px] uppercase tracking-[0.16em] text-neutral-500">{label}</dt>
                      <dd className="font-semibold">{value}</dd>
                    </div>
                  </div>
                ))}
              </dl>
              <Link
                href={`/contact?type=quote&service=${encodeURIComponent(`Similar to: ${project.title}`)}#quote`}
                className="mt-6 inline-flex h-12 w-full items-center justify-center bg-ink text-xs font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-brand-yellow hover:text-ink"
              >
                Want something similar?
              </Link>
            </aside>
          </Reveal>
        </Container>

        <Container className="mt-4">
          <Stagger className="grid gap-5 sm:grid-cols-3">
            {gallery.map((src, i) => (
              <StaggerItem key={i} className="relative aspect-[4/5] overflow-hidden bg-ink">
                <SmartImage src={src} alt={`${project.title} — view ${i + 1}`} seed={`${project.slug}-${i + 1}`} />
              </StaggerItem>
            ))}
          </Stagger>
        </Container>

        <Container className="mt-16 grid gap-4 border-t border-line pt-8 sm:grid-cols-2">
          <Link href={projectHref(prev)} className="group flex items-center gap-4">
            <span className="grid h-12 w-12 place-items-center border border-ink transition-colors group-hover:bg-brand-yellow"><ArrowLeft size={18} /></span>
            <span><span className="block text-[11px] uppercase tracking-[0.18em] text-neutral-500">Previous</span><span className="font-serif text-xl">{prev.title}</span></span>
          </Link>
          <Link href={projectHref(next)} className="group flex items-center justify-end gap-4 text-right">
            <span><span className="block text-[11px] uppercase tracking-[0.18em] text-neutral-500">Next</span><span className="font-serif text-xl">{next.title}</span></span>
            <span className="grid h-12 w-12 place-items-center border border-ink transition-colors group-hover:bg-brand-yellow"><ArrowRight size={18} /></span>
          </Link>
        </Container>
      </section>
      <CTABand />
    </>
  );
}
