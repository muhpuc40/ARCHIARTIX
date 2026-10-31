import { Code2, Globe, Mail, MapPin, Phone } from "lucide-react";
import { PageHeader } from "@/components/marketing/PageHeader";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Developer",
  description: `The ${siteConfig.name} website was designed and developed by ${siteConfig.developer.name} — a full-stack web developer based in Chattogram, Bangladesh.`,
  path: "/developer",
});

const stack = [
  ["Next.js 16 (App Router)", "Server-rendered pages, ISR and API routes"],
  ["TypeScript", "End-to-end type safety"],
  ["Tailwind CSS 4", "Design system and responsive layout"],
  ["Framer Motion", "Animations and transitions"],
  ["Supabase", "Postgres database, authentication and row-level security"],
  ["Cloudinary", "Image and video storage and delivery"],
  ["Zod + React Hook Form", "Validated forms on client and server"],
  ["PWA", "Installable, with offline support"],
];

export default function DeveloperPage() {
  const dev = siteConfig.developer;
  const links = [
    dev.email && { Icon: Mail, label: dev.email, href: `mailto:${dev.email}` },
    dev.phone && { Icon: Phone, label: dev.phone, href: `tel:${dev.phone.replace(/\s/g, "")}` },
    dev.website && { Icon: Globe, label: dev.website.replace(/^https?:\/\//, ""), href: dev.website },
    dev.github && { Icon: Code2, label: "GitHub", href: dev.github },
    dev.linkedin && { Icon: Globe, label: "LinkedIn", href: dev.linkedin },
  ].filter(Boolean) as { Icon: typeof Mail; label: string; href: string }[];

  return (
    <>
      <PageHeader
        eyebrow="Behind the site"
        title={<>Built by {dev.name}</>}
        text={`The ${siteConfig.name} website — design, code and database — was developed by ${dev.name}.`}
        crumbs={[{ name: "Developer", href: "/developer" }]}
        compact
      />
      <section className="py-16 sm:py-24">
        <Container className="grid gap-14 lg:grid-cols-[1fr_1.2fr]">
          <Reveal>
            <div className="border border-line bg-white p-8 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.25)]">
              <span className="grid h-20 w-20 place-items-center bg-brand-yellow font-serif text-4xl font-semibold">{dev.name.charAt(0)}</span>
              <h2 className="mt-6 font-serif text-3xl">{dev.name}</h2>
              <p className="mt-1 text-sm font-semibold uppercase tracking-[0.16em] text-neutral-500">Full-stack web developer</p>
              <p className="mt-4 flex items-center gap-2 text-sm text-neutral-600">
                <MapPin size={16} className="text-brand-yellow-deep" /> Chattogram, Bangladesh
              </p>
              <p className="mt-5 leading-relaxed text-neutral-700">
                Builds fast, secure web applications with Laravel, React and Next.js — from design and database to deployment. Available for web
                projects, e-commerce and custom business platforms.
              </p>
              {links.length > 0 && (
                <ul className="mt-6 space-y-3 border-t border-line pt-6">
                  {links.map(({ Icon, label, href }) => (
                    <li key={href}>
                      <a
                        href={href}
                        target={href.startsWith("http") ? "_blank" : undefined}
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 font-semibold hover:underline"
                      >
                        <Icon size={18} className="text-brand-yellow-deep" /> {label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h2 className="font-serif text-3xl">What this site is built with</h2>
            <ul className="mt-6 divide-y divide-line border-y border-line">
              {stack.map(([name, what]) => (
                <li key={name} className="flex flex-wrap items-baseline justify-between gap-2 py-4">
                  <span className="font-semibold">{name}</span>
                  <span className="text-sm text-neutral-600">{what}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
