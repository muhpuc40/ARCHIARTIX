import { WifiOff } from "lucide-react";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "You’re offline", description: "No internet connection.", path: "/offline", noindex: true });

export default function OfflinePage() {
  return (
    <main id="main" className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-charcoal-deep px-6 text-center text-white">
      <WifiOff size={48} className="text-brand-yellow" />
      <h1 className="font-serif text-4xl">You’re offline</h1>
      <p className="max-w-md text-white/70">Check your connection and try again — pages you have already visited may still open.</p>
      <Link href="/" className="bg-brand-yellow px-8 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-ink">Try again</Link>
    </main>
  );
}
