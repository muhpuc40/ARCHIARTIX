/**
 * Single source of truth for brand + contact details.
 * Edit via .env.local — nothing else in the codebase hardcodes these values.
 */
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

const clean = (v: string | undefined) => (v && v.trim().length > 0 ? v.trim() : "");

export const siteConfig = {
  name: "ARCHIAETIX",
  shortName: "Archiaetix",
  tagline: "Art Meets Architecture",
  description:
    "ARCHIAETIX is an interior design and architecture studio in Bangladesh — designing and building residential, commercial and hospitality spaces, with a shop for architecture and design products.",
  url: siteUrl,
  locale: "en_BD",
  // digits only, country code included, e.g. 8801XXXXXXXXX
  whatsapp: clean(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER).replace(/\D/g, ""),
  phone: clean(process.env.NEXT_PUBLIC_PHONE),
  email: clean(process.env.NEXT_PUBLIC_EMAIL),
  address: clean(process.env.NEXT_PUBLIC_ADDRESS) || "Dhaka & Chattogram, Bangladesh",
  hours: "Sat – Thu · 10:00 AM – 7:00 PM",
  // Embeddable 3D / 360° tour (Sketchfab, Matterport, Kuula, a Cloudinary video page …)
  tour3dUrl: clean(process.env.NEXT_PUBLIC_3D_VIEW_URL),
  mapsEmbedUrl: clean(process.env.NEXT_PUBLIC_MAPS_EMBED_URL),
  social: {
    facebook: clean(process.env.NEXT_PUBLIC_FACEBOOK_URL),
    instagram: clean(process.env.NEXT_PUBLIC_INSTAGRAM_URL),
    linkedin: clean(process.env.NEXT_PUBLIC_LINKEDIN_URL),
    youtube: clean(process.env.NEXT_PUBLIC_YOUTUBE_URL),
  },
  // Manual mobile-money payments (send money, then enter the transaction ID at checkout)
  payments: {
    bkash: clean(process.env.NEXT_PUBLIC_BKASH_NUMBER) || "01818173025",
    nagad: clean(process.env.NEXT_PUBLIC_NAGAD_NUMBER) || "01818173025",
  },
  colors: {
    yellow: "#FADF0B",
    charcoal: "#484848",
    ink: "#1B1B1B",
  },
} as const;

export function absoluteUrl(path = "/") {
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}

/** WhatsApp deep link. Falls back to the generic share link until a number is set. */
export function whatsappLink(text?: string) {
  const q = text ? `text=${encodeURIComponent(text)}` : "";
  if (siteConfig.whatsapp) {
    return `https://wa.me/${siteConfig.whatsapp}${q ? `?${q}` : ""}`;
  }
  return `https://api.whatsapp.com/send${q ? `?${q}` : ""}`;
}

export const WHATSAPP_GREETING = "Hi ARCHIAETIX, I'd like to discuss a project.";
