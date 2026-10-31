import { PageHeader } from "@/components/marketing/PageHeader";
import { Container } from "@/components/ui/Container";

export type LegalSection = { title: string; body: React.ReactNode };

/** Shared layout for the Privacy Policy and Terms of Service pages. */
export function LegalPage({
  eyebrow,
  title,
  path,
  updated,
  intro,
  sections,
}: {
  eyebrow: string;
  title: string;
  path: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
}) {
  return (
    <>
      <PageHeader eyebrow={eyebrow} title={title} text={`Last updated ${updated}`} crumbs={[{ name: title, href: path }]} compact />
      <section className="py-14 sm:py-20">
        <Container className="grid gap-12 lg:grid-cols-[260px_1fr]">
          <nav aria-label="On this page" className="hidden self-start lg:sticky lg:top-28 lg:block">
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">On this page</p>
            <ol className="space-y-2 border-l border-line text-sm">
              {sections.map((s, i) => (
                <li key={s.title}>
                  <a href={`#s${i + 1}`} className="-ml-px block border-l-2 border-transparent py-1 pl-4 text-neutral-600 hover:border-brand-yellow hover:text-ink">
                    {i + 1}. {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <article className="max-w-3xl">
            <p className="text-lg leading-relaxed text-neutral-700">{intro}</p>
            {sections.map((s, i) => (
              <section key={s.title} id={`s${i + 1}`} className="scroll-mt-28 pt-10">
                <h2 className="font-serif text-2xl sm:text-3xl">
                  <span className="mr-3 text-brand-yellow-deep">{String(i + 1).padStart(2, "0")}</span>
                  {s.title}
                </h2>
                <div className="mt-4 space-y-4 leading-relaxed text-neutral-700 [&_a]:font-semibold [&_a]:underline [&_li]:ml-5 [&_li]:list-disc [&_li]:pl-1 [&_ul]:space-y-2">
                  {s.body}
                </div>
              </section>
            ))}
          </article>
        </Container>
      </section>
    </>
  );
}
