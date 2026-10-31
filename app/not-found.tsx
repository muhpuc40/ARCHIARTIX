import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main" className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-charcoal-deep px-6 text-center text-white">
      <p className="font-serif text-8xl text-brand-yellow">404</p>
      <h1 className="font-serif text-3xl">This page isn’t part of the plan</h1>
      <p className="max-w-md text-white/70">The page you’re looking for has moved or never existed.</p>
      <div className="flex flex-wrap justify-center gap-4">
        <Link href="/" className="bg-brand-yellow px-8 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-ink">Back home</Link>
        <Link href="/projects" className="border border-white/70 px-8 py-4 text-xs font-semibold uppercase tracking-[0.12em] hover:bg-white hover:text-ink">See our projects</Link>
      </div>
    </main>
  );
}
