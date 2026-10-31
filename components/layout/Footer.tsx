import { Clock, Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  WhatsAppIcon,
  YoutubeIcon,
} from "@/components/ui/Icons";
import { siteConfig, whatsappLink, WHATSAPP_GREETING } from "@/lib/site";

const socials = [
  { key: "facebook", label: "Facebook", Icon: FacebookIcon },
  { key: "instagram", label: "Instagram", Icon: InstagramIcon },
  { key: "linkedin", label: "LinkedIn", Icon: LinkedinIcon },
  { key: "youtube", label: "YouTube", Icon: YoutubeIcon },
] as const;

const explore = [
  { label: "Projects", href: "/projects" },
  { label: "Services", href: "/services" },
  { label: "Shop", href: "/shop" },
  { label: "About Us", href: "/about" },
  { label: "Meet the Team", href: "/about/team" },
  { label: "Contact", href: "/contact" },
];
const services = [
  { label: "Interior Design", href: "/services/interior-design" },
  { label: "Architectural Design", href: "/services/architectural-design" },
  { label: "Turnkey Execution", href: "/services/turnkey-execution" },
  { label: "Get a Quote", href: "/contact?type=quote#quote" },
];

const legal = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Developer", href: "/developer" },
];

export function Footer() {
  const activeSocials = socials.filter((s) => siteConfig.social[s.key]);
  return (
    <footer className="relative mt-auto bg-ink text-white">
      <div className="h-1 w-full bg-brand-yellow" aria-hidden />
      <Container className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr]">
        <div>
          <Image
            src="/brand/logo-light.png"
            alt="ARCHIARTIX"
            width={1076}
            height={703}
            className="h-24 w-auto"
          />
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/65">
            Interior design and architecture studio in Bangladesh — designing,
            building and furnishing spaces where art meets architecture.
          </p>
          {activeSocials.length > 0 && (
            <div className="mt-6 flex gap-3">
              {activeSocials.map(({ key, label, Icon }) => (
                <a
                  key={key}
                  href={siteConfig.social[key]}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/20 transition-colors hover:border-brand-yellow hover:bg-brand-yellow hover:text-ink">
                  <Icon size={17} />
                </a>
              ))}
            </div>
          )}
        </div>

        <FooterList title="Explore" links={explore} />
        <FooterList title="Services" links={services} />

        <div>
          <h3 className="mb-5 font-sans text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-yellow">
            Contact
          </h3>
          <ul className="space-y-3.5 text-sm text-white/75">
            <li className="flex gap-3">
              <MapPin size={17} className="mt-0.5 shrink-0 text-brand-yellow" />{" "}
              {siteConfig.address}
            </li>
            {siteConfig.phone && (
              <li>
                <a
                  href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
                  className="flex gap-3 hover:text-brand-yellow">
                  <Phone
                    size={17}
                    className="mt-0.5 shrink-0 text-brand-yellow"
                  />{" "}
                  {siteConfig.phone}
                </a>
              </li>
            )}
            {siteConfig.email && (
              <li>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="flex gap-3 hover:text-brand-yellow">
                  <Mail
                    size={17}
                    className="mt-0.5 shrink-0 text-brand-yellow"
                  />{" "}
                  {siteConfig.email}
                </a>
              </li>
            )}
            <li>
              <a
                href={whatsappLink(WHATSAPP_GREETING)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-3 hover:text-brand-yellow">
                <WhatsAppIcon size={17} /> Chat on WhatsApp
              </a>
            </li>
            <li className="flex gap-3">
              <Clock size={17} className="mt-0.5 shrink-0 text-brand-yellow" />{" "}
              {siteConfig.hours}
            </li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col items-center justify-between gap-2 py-6 text-xs text-white/60 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <nav
            aria-label="Legal"
            className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {legal.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="transition-colors hover:text-brand-yellow">
                {l.label}
              </Link>
            ))}
          </nav>
        </Container>
      </div>
    </footer>
  );
}

function FooterList({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <nav aria-label={title}>
      <h3 className="mb-5 font-sans text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-yellow">
        {title}
      </h3>
      <ul className="space-y-3 text-sm text-white/75">
        {links.map((l) => (
          <li key={l.href + l.label}>
            <Link
              href={l.href}
              className="inline-block transition-all hover:translate-x-1 hover:text-brand-yellow">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
