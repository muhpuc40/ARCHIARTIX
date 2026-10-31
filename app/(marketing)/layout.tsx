import { BackToTop } from "@/components/layout/BackToTop";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Preloader } from "@/components/layout/Preloader";
import { ServiceWorkerRegister } from "@/components/layout/ServiceWorkerRegister";
import { SideDrawer } from "@/components/layout/SideDrawer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { UIProvider } from "@/components/providers/UIProvider";
import { CartSync } from "@/components/shop/CartSync";
import { JsonLd } from "@/components/ui/JsonLd";
import { absoluteUrl, siteConfig } from "@/lib/site";

// Public pages are statically generated and refreshed at most once a minute.
export const revalidate = 60;

const sameAs = Object.values(siteConfig.social).filter(Boolean);

const businessJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["LocalBusiness", "InteriorDesigner"],
      "@id": `${siteConfig.url}/#business`,
      name: siteConfig.name,
      slogan: siteConfig.tagline,
      description: siteConfig.description,
      url: siteConfig.url,
      logo: absoluteUrl("/icons/icon-512.png"),
      image: absoluteUrl("/og.jpg"),
      areaServed: { "@type": "Country", name: "Bangladesh" },
      address: { "@type": "PostalAddress", addressCountry: "BD", streetAddress: siteConfig.address },
      ...(siteConfig.phone && { telephone: siteConfig.phone }),
      ...(siteConfig.email && { email: siteConfig.email }),
      ...(sameAs.length && { sameAs }),
      priceRange: "৳৳৳",
    },
    {
      "@type": "WebSite",
      "@id": `${siteConfig.url}/#website`,
      url: siteConfig.url,
      name: siteConfig.name,
      publisher: { "@id": `${siteConfig.url}/#business` },
      inLanguage: "en",
    },
  ],
};

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <UIProvider>
      <noscript>
        <style>{"#preloader{display:none!important}"}</style>
      </noscript>
      <Preloader />
      <Header />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
      <WhatsAppButton />
      <BackToTop />
      <SideDrawer />
      <CartDrawer />
      <CartSync />
      <ServiceWorkerRegister />
      <JsonLd data={businessJsonLd} />
    </UIProvider>
  );
}
