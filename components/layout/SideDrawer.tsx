"use client";

import { ChevronDown, Clock, LogIn, Mail, MapPin, Phone, UserRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { InstallButton } from "@/components/layout/InstallButton";
import { useUI } from "@/components/providers/UIProvider";
import { ButtonLink } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { FacebookIcon, InstagramIcon, LinkedinIcon, WhatsAppIcon, YoutubeIcon } from "@/components/ui/Icons";
import { navItems } from "@/lib/content";
import { siteConfig, whatsappLink, WHATSAPP_GREETING } from "@/lib/site";
import { useAuth } from "@/lib/use-auth";

const socials = [
  { key: "facebook", label: "Facebook", Icon: FacebookIcon },
  { key: "instagram", label: "Instagram", Icon: InstagramIcon },
  { key: "linkedin", label: "LinkedIn", Icon: LinkedinIcon },
  { key: "youtube", label: "YouTube", Icon: YoutubeIcon },
] as const;

export function SideDrawer() {
  const { menuOpen, closeMenu } = useUI();
  const auth = useAuth();
  const [expanded, setExpanded] = useState<string | null>(null);
  const activeSocials = socials.filter((s) => siteConfig.social[s.key]);

  return (
    <Drawer open={menuOpen} onClose={closeMenu} label="Site menu" tone="dark" className="overflow-y-auto">
      <div className="flex flex-1 flex-col gap-8 px-7 pb-8 pt-8">
        <div>
          <Image src="/brand/logo-light.png" alt="ARCHIARTIX" width={1076} height={703} className="h-20 w-auto" />
          <p className="mt-5 text-sm leading-relaxed text-white/70">
            {siteConfig.name} is an interior design and architecture studio in Bangladesh. We design, build and furnish
            spaces where art meets architecture.
          </p>
        </div>

        {/* Full navigation — visible on small screens where the header nav is hidden */}
        <nav aria-label="Mobile" className="lg:hidden">
          <ul className="divide-y divide-white/10 border-y border-white/10">
            {navItems.map((item) => (
              <li key={item.label}>
                {item.children ? (
                  <>
                    <button
                      type="button"
                      aria-expanded={expanded === item.label}
                      onClick={() => setExpanded(expanded === item.label ? null : item.label)}
                      className="flex w-full items-center justify-between py-3.5 text-left text-sm font-semibold uppercase tracking-[0.14em]"
                    >
                      {item.label}
                      <ChevronDown size={16} className={expanded === item.label ? "rotate-180 transition-transform" : "transition-transform"} />
                    </button>
                    {expanded === item.label && (
                      <ul className="mb-3 space-y-1 border-l border-brand-yellow/60 pl-4">
                        {item.children.map((c) => (
                          <li key={c.href}>
                            <Link href={c.href} onClick={closeMenu} className="block py-1.5 text-sm text-white/75 hover:text-brand-yellow">
                              {c.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <Link href={item.href} onClick={closeMenu} className="block py-3.5 text-sm font-semibold uppercase tracking-[0.14em] hover:text-brand-yellow">
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="grid gap-3">
          <ButtonLink href="/contact?type=quote#quote" onClick={closeMenu} size="lg">
            Get a Quote
          </ButtonLink>
          <InstallButton className="w-full" />
        </div>

        <div className="space-y-3 text-sm text-white/80">
          <h3 className="font-sans text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-yellow">Quick contact</h3>
          <a
            href={whatsappLink(WHATSAPP_GREETING)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 hover:text-brand-yellow"
          >
            <WhatsAppIcon size={18} /> Chat on WhatsApp
          </a>
          {siteConfig.phone && (
            <a href={`tel:${siteConfig.phone.replace(/\s/g, "")}`} className="flex items-center gap-3 hover:text-brand-yellow">
              <Phone size={18} /> {siteConfig.phone}
            </a>
          )}
          {siteConfig.email && (
            <a href={`mailto:${siteConfig.email}`} className="flex items-center gap-3 hover:text-brand-yellow">
              <Mail size={18} /> {siteConfig.email}
            </a>
          )}
          <p className="flex items-start gap-3">
            <MapPin size={18} className="mt-0.5 shrink-0" /> {siteConfig.address}
          </p>
          <p className="flex items-start gap-3">
            <Clock size={18} className="mt-0.5 shrink-0" /> {siteConfig.hours}
          </p>
        </div>

        {activeSocials.length > 0 && (
          <div className="flex gap-3">
            {activeSocials.map(({ key, label, Icon }) => (
              <a
                key={key}
                href={siteConfig.social[key]}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="grid h-11 w-11 place-items-center rounded-full border border-white/25 transition-colors hover:border-brand-yellow hover:bg-brand-yellow hover:text-ink"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        )}

        <div className="mt-auto border-t border-white/10 pt-6">
          {auth.signedIn ? (
            <Link href="/account" onClick={closeMenu} className="flex items-center gap-3 text-sm font-semibold hover:text-brand-yellow">
              <UserRound size={18} /> My account{auth.name ? ` · ${auth.name.split(" ")[0]}` : ""}
            </Link>
          ) : (
            <Link href="/login" onClick={closeMenu} className="flex items-center gap-3 text-sm font-semibold hover:text-brand-yellow">
              <LogIn size={18} /> Sign in / Create account
            </Link>
          )}
        </div>
      </div>
    </Drawer>
  );
}
