import { Glasses, Orbit, View } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { ThreeDPlaceholder, ThreeDViewer } from "@/components/marketing/ThreeDViewer";
import { siteConfig } from "@/lib/site";

export function VRCallout() {
  return (
    <section className="bg-brand-cream py-20 sm:py-24">
      <Container>
        <div className="relative grid items-center gap-10 overflow-hidden bg-ink p-8 text-white sm:p-14 lg:grid-cols-2">
          <svg className="absolute -right-20 -top-20 h-96 w-96 opacity-20" viewBox="0 0 200 200" fill="none" aria-hidden>
            {[90, 70, 50, 30].map((r) => (
              <circle key={r} cx="100" cy="100" r={r} stroke="#FADF0B" strokeWidth="1" />
            ))}
            <ellipse cx="100" cy="100" rx="90" ry="30" stroke="#fff" strokeWidth=".6" />
            <ellipse cx="100" cy="100" rx="30" ry="90" stroke="#fff" strokeWidth=".6" />
          </svg>
          <Reveal className="relative">
            <p className="mb-4 inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-yellow">
              <span className="h-px w-8 bg-brand-yellow" aria-hidden /> 360° · VR
            </p>
            <h2 className="text-3xl leading-tight sm:text-4xl lg:text-5xl">
              Walk through your space <span className="text-brand-yellow">before</span> it exists.
            </h2>
            <p className="mt-5 max-w-xl text-white/70">
              Every project includes photo-real 3D renders. On request we build 360° panoramas and VR walkthroughs, so
              you can test layouts, light and finishes — and change your mind while it is still free.
            </p>
            <ButtonLink href="/contact?type=quote&service=3D%20%2F%20VR%20walkthrough#quote" className="mt-8">
              Request a walkthrough
            </ButtonLink>
          </Reveal>
          <Reveal delay={0.1} direction="left" className="relative space-y-4">
            {siteConfig.tour3dUrl ? <ThreeDViewer src={siteConfig.tour3dUrl} /> : <ThreeDPlaceholder />}
            <div className="grid grid-cols-3 gap-3">
              {[
                { Icon: View, label: "360° panoramas" },
                { Icon: Glasses, label: "VR headset tours" },
                { Icon: Orbit, label: "3D fly-throughs" },
              ].map(({ Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-2 border border-white/15 bg-white/[0.04] p-3 text-center">
                  <Icon size={22} className="text-brand-yellow" />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.12em]">{label}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
