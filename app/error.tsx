"use client";

import Link from "next/link";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main id="main" className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-charcoal-deep px-6 text-center text-white">
      <h1 className="font-serif text-4xl">Something went wrong</h1>
      <p className="max-w-md text-white/70">An unexpected error occurred. Please try again — if it keeps happening, message us on WhatsApp.</p>
      <div className="flex flex-wrap justify-center gap-4">
        <button onClick={reset} className="bg-brand-yellow px-8 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-ink">Try again</button>
        <Link href="/" className="border border-white/70 px-8 py-4 text-xs font-semibold uppercase tracking-[0.12em] hover:bg-white hover:text-ink">Home</Link>
      </div>
    </main>
  );
}
