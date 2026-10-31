import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/marketing/ContactForm";
import { PageHeader } from "@/components/marketing/PageHeader";
import { Container } from "@/components/ui/Container";
import { WhatsAppIcon } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { pageMetadata } from "@/lib/seo";
import { siteConfig, whatsappLink, WHATSAPP_GREETING } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Contact & Get a Quote",
  description:
    "Talk to ARCHIARTIX about your interior or architecture project. Request a quote, book a discovery call or message us on WhatsApp — we reply within one working day.",
  path: "/contact",
});

type Props = { searchParams: Promise<{ type?: string; service?: string }> };

export default async function ContactPage({ searchParams }: Props) {
  const sp = await searchParams;
  const kind = sp.type === "quote" ? "quote" : "contact";
  const service = typeof sp.service === "string" ? sp.service.slice(0, 80) : "";

  const items = [
    {
      Icon: MapPin,
      label: "Studio",
      value: siteConfig.address,
      href: undefined as string | undefined,
    },
    siteConfig.phone && {
      Icon: Phone,
      label: "Call us",
      value: siteConfig.phone,
      href: `tel:${siteConfig.phone.replace(/\s/g, "")}`,
    },
    siteConfig.email && {
      Icon: Mail,
      label: "Email",
      value: siteConfig.email,
      href: `mailto:${siteConfig.email}`,
    },
    { Icon: Clock, label: "Hours", value: siteConfig.hours, href: undefined },
  ].filter(Boolean) as {
    Icon: typeof MapPin;
    label: string;
    value: string;
    href?: string;
  }[];

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Let’s talk about your space"
        text="Tell us what you’re planning. We reply within one working day — usually sooner."
        crumbs={[{ name: "Contacts", href: "/contact" }]}
      />
      <section id="quote" className="scroll-mt-24 py-16 sm:py-24">
        <Container className="grid gap-14 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          <div className="space-y-8">
            <Reveal>
              <ul className="divide-y divide-line border-y border-line">
                {items.map(({ Icon, label, value, href }) => (
                  <li key={label} className="flex items-start gap-5 py-5">
                    <span className="grid h-12 w-12 shrink-0 place-items-center bg-brand-yellow">
                      <Icon size={22} />
                    </span>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                        {label}
                      </p>
                      {href ? (
                        <a
                          href={href}
                          className="mt-1 block font-semibold hover:underline">
                          {value}
                        </a>
                      ) : (
                        <p className="mt-1 font-semibold">{value}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.1}>
              <a
                href={whatsappLink(WHATSAPP_GREETING)}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between gap-4 bg-ink p-6 text-white transition-colors hover:bg-brand-yellow hover:text-ink">
                <span className="flex items-center gap-4">
                  <WhatsAppIcon size={34} />
                  <span>
                    <span className="block font-serif text-xl">
                      Prefer WhatsApp?
                    </span>
                    <span className="text-sm opacity-70">
                      Chat with the team instantly
                    </span>
                  </span>
                </span>
                <span
                  aria-hidden
                  className="text-2xl transition-transform group-hover:translate-x-1">
                  →
                </span>
              </a>
            </Reveal>

            <Reveal delay={0.15}>
              <iframe
                title="ARCHIARTIX — Chattogram map"
                src={siteConfig.mapsEmbedUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-72 w-full border border-line"
              />
              <a
                href={siteConfig.mapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-2 text-sm font-semibold hover:underline">
                <MapPin size={16} /> Open in Google Maps
              </a>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <div className="border border-line bg-white p-6 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.25)] sm:p-10">
              <h2 className="font-serif text-3xl">Send us a message</h2>
              <p className="mb-8 mt-2 text-sm text-neutral-600">
                Fields marked * are required.
              </p>
              <ContactForm defaultKind={kind} defaultService={service} />
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
