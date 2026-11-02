import Link from "next/link";
import { CTABand } from "@/components/marketing/CTABand";
import { PageHeader } from "@/components/marketing/PageHeader";
import { StatsBand } from "@/components/marketing/StatsBand";
import { Container } from "@/components/ui/Container";
import { PlaceholderArt } from "@/components/ui/PlaceholderArt";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { story, values } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "About Us — Our Story & Values",
  description:
    "ARCHIARTIX is a Bangladeshi studio of architects, interior designers and site engineers who believe art and architecture belong in the same conversation.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About us"
        title="Art and architecture, in one conversation"
        text="A studio of architects, interior designers and engineers building calmer, brighter spaces across Bangladesh."
        crumbs={[{ name: "About Us", href: "/about" }]}
      />

      <section className="py-20 sm:py-28">
        <Container className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal className="relative order-2 lg:order-1">
            <div className="relative aspect-[4/5] overflow-hidden bg-ink">
              <PlaceholderArt seed="our-story" />
            </div>
            <div className="absolute -bottom-4 -right-4 hidden h-28 w-28 border-b-4 border-r-4 border-brand-yellow sm:block" aria-hidden />
          </Reveal>
          <div className="order-1 lg:order-2">
            <SectionHeading eyebrow="Our story" title="Designing for how Bangladesh lives" />
            <div className="mt-8 space-y-5 text-lg leading-relaxed text-neutral-700">
              {story.map((p, i) => (
                <Reveal key={i} delay={0.05 * i}>
                  <p>{p}</p>
                </Reveal>
              ))}
            </div>
            <Reveal delay={0.2} className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm font-semibold uppercase tracking-[0.14em]">
              <Link href="/about/team" className="underline decoration-brand-yellow decoration-2 underline-offset-8 hover:text-charcoal">Meet our team</Link>
              <Link href="/about/mission-vision" className="underline decoration-brand-yellow decoration-2 underline-offset-8 hover:text-charcoal">Mission & vision</Link>
            </Reveal>
          </div>
        </Container>
      </section>

      <StatsBand />

      <section className="py-20 sm:py-28">
        <Container>
          <SectionHeading eyebrow="Our values" title="What we hold ourselves to" />
          <Stagger className="mt-14 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <StaggerItem key={v.title} className="bg-white p-8 transition-colors hover:bg-brand-cream">
                <span className="font-serif text-5xl font-bold text-brand-yellow">0{i + 1}</span>
                <h3 className="mt-4 font-sans text-sm font-bold uppercase tracking-[0.14em]">{v.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-neutral-600">{v.text}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>
      <CTABand />
    </>
  );
}
