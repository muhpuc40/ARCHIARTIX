import { CTABand } from "@/components/marketing/CTABand";
import { PageHeader } from "@/components/marketing/PageHeader";
import { Container } from "@/components/ui/Container";
import { PlaceholderArt } from "@/components/ui/PlaceholderArt";
import { Stagger, StaggerItem } from "@/components/ui/Reveal";
import { team } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Meet Our Team",
  description:
    "The architects, interior designers, site managers and visualisers behind ARCHIARTIX — a small, senior team that stays close to every project.",
  path: "/about/team",
});

export default function TeamPage() {
  return (
    <>
      <PageHeader
        eyebrow="Our people"
        title="Meet the team behind the work"
        text="A small, senior studio — the people you meet in the first call are the people who design and deliver your project."
        crumbs={[
          { name: "About Us", href: "/about" },
          { name: "Meet Our Team", href: "/about/team" },
        ]}
      />
      <section className="py-16 sm:py-24">
        <Container>
          <Stagger className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((m) => (
              <StaggerItem key={m.role} className="group">
                <div className="relative aspect-[4/5] overflow-hidden bg-ink">
                  <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
                    <PlaceholderArt seed={`team-${m.role}`} />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-brand-yellow transition-transform duration-500 group-hover:scale-x-100" />
                </div>
                <h2 className="mt-5 font-serif text-2xl">{m.role}</h2>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                  {m.bio}
                </p>
              </StaggerItem>
            ))}
          </Stagger>
          {process.env.NODE_ENV !== "production" && (
            <p className="mt-12 border border-dashed border-red-700 p-4 text-sm text-red-700">
              Dev note: team members are placeholders (roles only). Add real
              names, photos and bios in lib/content.ts before launch.
            </p>
          )}
        </Container>
      </section>
      <CTABand
        title="Want to work with us?"
        text="We’re always keen to meet clients — and talented designers and engineers. Say hello."
      />
    </>
  );
}
