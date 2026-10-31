import { HeroManager } from "@/components/admin/HeroManager";
import { requireAdmin } from "@/lib/auth";
import { HERO_TIMING } from "@/lib/hero-config";
import type { HeroSlide } from "@/lib/types";

export const metadata = { title: "Hero images" };

export default async function AdminHeroPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("hero_slides").select("*").order("sort_order").order("created_at", { ascending: false });
  const slides = (data ?? []) as HeroSlide[];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-serif text-4xl">Hero images</h1>
        <p className="mt-1 max-w-2xl text-sm text-neutral-600">
          The home page starts with the animated hero for {HERO_TIMING.animatedSeconds}s, then shows these images one by one ({HERO_TIMING.slideSeconds}s each),
          then returns to the animated hero for {HERO_TIMING.animatedSeconds}s and repeats. With no images, only the animated hero shows. Change the
          timings in <code className="bg-neutral-200 px-1">lib/hero-config.ts</code>.
        </p>
      </header>
      <HeroManager slides={slides} />
    </div>
  );
}
