import { ArrowRight, Check } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CTABand } from "@/components/marketing/CTABand";
import { PageHeader } from "@/components/marketing/PageHeader";
import { ProcessTimeline } from "@/components/marketing/ProcessTimeline";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { JsonLd } from "@/components/ui/JsonLd";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { SmartImage } from "@/components/ui/SmartImage";
import { getServiceBySlug, getServices } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getServices()).map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return {};
  return pageMetadata({
    title: `${service.title} in Bangladesh`,
    description: service.summary,
    path: `/services/${service.slug}`,
    image: service.image_url ?? undefined,
  });
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) notFound();
  const others = (await getServices()).filter((s) => s.id !== service.id);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.summary,
    provider: { "@id": `${siteConfig.url}/#business` },
    areaServed: { "@type": "Country", name: "Bangladesh" },
    serviceType: service.title,
  };

  return (
    <>
      <PageHeader
        eyebrow="Service"
        title={service.title}
        text={service.summary}
        crumbs={[
          { name: "Services", href: "/services" },
          { name: service.title, href: `/services/${service.slug}` },
        ]}
      >
        <ButtonLink href={`/contact?type=quote&service=${encodeURIComponent(service.title)}#quote`}>
          Request a quote <ArrowRight size={16} />
        </ButtonLink>
      </PageHeader>

      <section className="py-16 sm:py-24">
        <Container className="grid gap-14 lg:grid-cols-[1.4fr_1fr] lg:gap-20">
          <Reveal>
            <div className="relative aspect-[16/9] overflow-hidden bg-ink">
              <SmartImage src={service.image_url} alt={service.title} seed={`service-${service.slug}`} priority sizes="(min-width:1024px) 55vw, 100vw" />
            </div>
            <div className="mt-10 space-y-6 text-lg leading-relaxed text-neutral-700">
              {service.description.split("\n\n").map((para) => (
                <p key={para.slice(0, 24)}>{para}</p>
              ))}
            </div>
          </Reveal>

          <aside>
            <Reveal direction="left" className="border-t-4 border-brand-yellow bg-brand-cream p-8">
              <h2 className="font-sans text-xs font-bold uppercase tracking-[0.24em]">What’s included</h2>
              <Stagger className="mt-6 space-y-4">
                {service.features.map((f) => (
                  <StaggerItem key={f} className="flex gap-3 text-sm font-medium">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-yellow">
                      <Check size={13} strokeWidth={3} />
                    </span>
                    {f}
                  </StaggerItem>
                ))}
              </Stagger>
            </Reveal>
            <Reveal direction="left" delay={0.1} className="mt-6 bg-ink p-8 text-white">
              <p className="font-serif text-2xl leading-snug">Not sure where to start?</p>
              <p className="mt-3 text-sm text-white/70">A 30-minute discovery call is free — we’ll help you scope the project.</p>
              <ButtonLink href="/contact#quote" className="mt-6 w-full">
                Book a discovery call
              </ButtonLink>
            </Reveal>
          </aside>
        </Container>
      </section>

      <ProcessTimeline />

      <section className="bg-brand-cream py-16 sm:py-20">
        <Container>
          <h2 className="font-serif text-3xl">Other services</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {others.map((o) => (
              <Link
                key={o.id}
                href={`/services/${o.slug}`}
                className="group flex items-center justify-between border border-line bg-white p-6 transition-colors hover:border-brand-yellow hover:bg-brand-yellow"
              >
                <span>
                  <span className="block font-serif text-xl">{o.title}</span>
                  <span className="mt-1 block text-sm text-neutral-600 group-hover:text-ink/80">{o.summary}</span>
                </span>
                <ArrowRight size={20} className="shrink-0 transition-transform group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </Container>
      </section>
      <CTABand />
      <JsonLd data={jsonLd} />
    </>
  );
}
