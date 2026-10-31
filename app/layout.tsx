import type { Metadata, Viewport } from "next";
import "@fontsource-variable/montserrat";
import "@fontsource-variable/playfair-display";
import "./globals.css";
import { CursorBall } from "@/components/ui/CursorBall";
import { Providers } from "@/components/providers/Providers";
import { siteConfig } from "@/lib/site";

const title = `${siteConfig.name} — ${siteConfig.tagline} | Interior Design & Architecture in Bangladesh`;

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: title, template: `%s | ${siteConfig.name}` },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "interior design Bangladesh",
    "architecture firm Dhaka",
    "interior designer Chattogram",
    "turnkey interior execution",
    "residential interior design",
    "commercial interior design",
    "ARCHIAETIX",
  ],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    url: siteConfig.url,
    title,
    description: siteConfig.description,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: `${siteConfig.name} — ${siteConfig.tagline}` }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: siteConfig.description,
    images: ["/og.jpg"],
  },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
  appleWebApp: { capable: true, title: siteConfig.name, statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = {
  themeColor: "#FADF0B",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:bg-brand-yellow focus:px-5 focus:py-3 focus:text-sm focus:font-bold focus:text-ink"
        >
          Skip to content
        </a>
        <Providers>{children}</Providers>
        <CursorBall />
      </body>
    </html>
  );
}
