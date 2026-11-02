import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/LoginForm";
import { getUser } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/env";
import { pageMetadata } from "@/lib/seo";
import { safeNext } from "@/lib/utils";

export const metadata = pageMetadata({
  title: "Sign in",
  description: "Sign in to ARCHIARTIX with Google to order from the Collection and track your orders.",
  path: "/login",
  noindex: true,
});

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ next?: string; error?: string }> };

export default async function LoginPage({ searchParams }: Props) {
  const sp = await searchParams;
  const next = safeNext(sp.next);

  if (isSupabaseConfigured && (await getUser())) redirect(next);

  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <section className="blueprint-bg relative hidden flex-col justify-between overflow-hidden bg-ink p-12 text-white lg:flex">
        <svg className="draw-line pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 600 900" preserveAspectRatio="xMidYMid slice" fill="none" aria-hidden>
          <path d="M380 -10 L580 910" stroke="#FADF0B" strokeWidth="3" opacity=".7" style={{ ["--len" as string]: 1000 }} />
          <path d="M100 900 L330 300 L430 560" stroke="#fff" strokeOpacity=".25" strokeWidth="2" className="delay-1" style={{ ["--len" as string]: 1000 }} />
        </svg>
        <Link href="/" className="relative"><Image src="/brand/logo-light.png" alt="ARCHIARTIX" width={1076} height={703} className="h-24 w-auto" priority /></Link>
        <div className="relative max-w-md">
          <p className="font-serif text-4xl leading-tight">Welcome back to <span className="text-brand-yellow">ARCHIARTIX</span>.</p>
          <p className="mt-4 text-white/70">Sign in to order from the Collection, track deliveries and keep your details handy.</p>
        </div>
      </section>

      <section className="flex flex-col justify-center px-6 py-12 sm:px-14">
        <div className="mx-auto w-full max-w-md">
          <Link href="/" className="mb-10 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-neutral-600 hover:text-ink">
            <ArrowLeft size={14} /> Back to site
          </Link>
          <h1 className="font-serif text-4xl">Sign in</h1>
          <p className="mb-8 mt-2 text-neutral-600">Continue with Google — it takes one click.</p>

          {!isSupabaseConfigured ? (
            <div className="space-y-3 border-l-4 border-brand-yellow bg-brand-cream p-6 text-sm">
              <p className="font-semibold">Backend not connected yet</p>
              <p className="text-neutral-700">Add your Supabase keys to <code className="bg-white px-1">.env.local</code> and restart the dev server to enable sign-in. See the README → “Connect Supabase”.</p>
            </div>
          ) : (
            <LoginForm next={next} error={sp.error} />
          )}
        </div>
      </section>
    </div>
  );
}
