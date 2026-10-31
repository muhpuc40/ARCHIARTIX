import { Compass, Target } from "lucide-react";
import { CTABand } from "@/components/marketing/CTABand";
import { PageHeader } from "@/components/marketing/PageHeader";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { mission, vision } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Mission & Vision",
  description: "What drives ARCHIAETIX: our mission to design calmer, brighter spaces in Bangladesh and our vision for place-rooted architecture and interiors.",
  path: "/about/mission-vision",
});

export default function MissionVisionPage() {
  const blocks = [
    { Icon: Target, label: "Our mission", text: mission, dark: false },
    { Icon: Compass, label: "Our vision", text: vision, dark: true },
  ];
  return (
    <>
      <PageHeader
        eyebrow="Purpose"
        title="Why we design"
        crumbs={[
          { name: "About Us", href: "/about" },
          { name: "Mission & Vision", href: "/about/mission-vision" },
        ]}
      />
      <section className="py-16 sm:py-24">
        <Container className="grid gap-6 lg:grid-cols-2">
          {blocks.map(({ Icon, label, text, dark }, i) => (
            <Reveal key={label} delay={i * 0.1}>
              <article className={dark ? "h-full bg-ink p-10 text-white sm:p-14" : "h-full border border-line bg-brand-cream p-10 sm:p-14"}>
                <span className={dark ? "grid h-16 w-16 place-items-center bg-brand-yellow text-ink" : "grid h-16 w-16 place-items-center bg-ink text-brand-yellow"}>
                  <Icon size={30} />
                </span>
                <h2 className="mt-8 font-serif text-4xl">{label}</h2>
                <p className={dark ? "mt-5 text-lg leading-relaxed text-white/75" : "mt-5 text-lg leading-relaxed text-neutral-700"}>{text}</p>
              </article>
            </Reveal>
          ))}
        </Container>
      </section>
      <CTABand />
    </>
  );
}
