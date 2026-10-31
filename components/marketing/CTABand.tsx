import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { whatsappLink, WHATSAPP_GREETING } from "@/lib/site";

export function CTABand({
  title = "Let’s design something remarkable.",
  text = "Tell us about your space. We’ll respond within one working day with next steps and a clear scope.",
}: {
  title?: string;
  text?: string;
}) {
  return (
    <section className="diag-bottom relative overflow-hidden bg-brand-yellow pb-28 pt-20 text-ink sm:pt-24">
      <svg className="pointer-events-none absolute -right-10 top-0 h-full w-1/2 opacity-30" viewBox="0 0 400 300" fill="none" preserveAspectRatio="xMaxYMid slice" aria-hidden>
        <path d="M250 -10 L390 310" stroke="#1b1b1b" strokeWidth="3" />
        <path d="M150 310 L250 100 L300 200" stroke="#1b1b1b" strokeWidth="2" />
        <path d="M110 220 H380" stroke="#1b1b1b" strokeWidth="2" />
      </svg>
      <Container className="relative grid items-center gap-10 lg:grid-cols-[1.4fr_1fr]">
        <Reveal>
          <h2 className="text-4xl leading-[1.05] sm:text-5xl lg:text-6xl">{title}</h2>
          <p className="mt-5 max-w-xl text-lg text-ink/75">{text}</p>
        </Reveal>
        <Reveal delay={0.1} className="flex flex-wrap gap-4 lg:justify-end">
          <ButtonLink href="/contact?type=quote#quote" variant="dark" size="lg">
            Get a free quote <ArrowRight size={18} />
          </ButtonLink>
          <a
            href={whatsappLink(WHATSAPP_GREETING)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-14 items-center justify-center rounded-[2px] border border-ink px-9 text-xs font-semibold uppercase tracking-[0.12em] transition-colors hover:bg-ink hover:text-brand-yellow sm:text-[13px]"
          >
            WhatsApp us
          </a>
        </Reveal>
      </Container>
    </section>
  );
}
