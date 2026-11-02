import type { Metadata } from "next";
import { AboutIntro } from "@/components/marketing/AboutIntro";
import { CTABand } from "@/components/marketing/CTABand";
import { FAQSection } from "@/components/marketing/FAQSection";
import { FeaturedProjects } from "@/components/marketing/FeaturedProjects";
import { Hero } from "@/components/marketing/Hero";
import { ProcessTimeline } from "@/components/marketing/ProcessTimeline";
import { ServicesPreview } from "@/components/marketing/ServicesPreview";
import { StatsBand } from "@/components/marketing/StatsBand";
import { Testimonials } from "@/components/marketing/Testimonials";
import { VRCallout } from "@/components/marketing/VRCallout";
import { PlanWizard } from "@/components/plan/PlanWizard";
import { getCategories, getHeroSlides, getSiteSettings, getTestimonials } from "@/lib/data";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: `${siteConfig.name} — ${siteConfig.tagline} | Interior Design & Architecture in Bangladesh` },
  description:
    "ARCHIARTIX designs, builds and furnishes homes, offices and hospitality spaces across Bangladesh. Interior design, architectural design and turnkey execution — plus a Collection of design products.",
  alternates: { canonical: "/" },
};

// Home intentionally has no Team, Collection or pricing sections (they live on their own routes).
export default async function HomePage() {
  const [testimonials, categories, heroSlides, media] = await Promise.all([getTestimonials(), getCategories("project"), getHeroSlides(), getSiteSettings()]);
  return (
    <>
      <Hero slides={heroSlides} />
      <StatsBand />
      <AboutIntro />
      <FeaturedProjects />
      <ServicesPreview />
      <ProcessTimeline />
      <VRCallout tour3dUrl={media.tour3d_url || siteConfig.tour3dUrl} videoUrl={media.video_url || siteConfig.videoUrl} />
      <Testimonials items={testimonials} />
      <PlanWizard categories={categories.map((c) => ({ id: c.id, name: c.name, slug: c.slug }))} />
      <FAQSection />
      <CTABand />
    </>
  );
}
