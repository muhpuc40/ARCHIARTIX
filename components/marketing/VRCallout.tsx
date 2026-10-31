import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { WalkthroughMedia } from "@/components/marketing/WalkthroughMedia";

export function VRCallout({ videoUrl, tour3dUrl }: { videoUrl: string; tour3dUrl: string }) {
  return (
    <section className="bg-brand-cream py-20 sm:py-24">
      <Container>
        <div className="bg-ink p-6 text-white sm:p-12">
          <Reveal className="grid items-end gap-8 lg:grid-cols-[1.3fr_1fr]">
            <div>
              <p className="mb-4 inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-yellow">
                <span className="h-px w-8 bg-brand-yellow" aria-hidden /> 3D · Video
              </p>
              <h2 className="text-3xl leading-tight sm:text-4xl lg:text-5xl">
                Walk through your space <span className="text-brand-yellow">before</span> it exists.
              </h2>
            </div>
            <div>
              <p className="text-white/70">See layouts, light and finishes in 3D, and change your mind while it is still free.</p>
              <ButtonLink href="/contact?type=quote&service=3D%20%2F%20VR%20walkthrough#quote" className="mt-6">
                Request a walkthrough
              </ButtonLink>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="mt-8 sm:mt-10">
            <WalkthroughMedia videoUrl={videoUrl} tour3dUrl={tour3dUrl} />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
