import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/auth/AdminLoginForm";
import { getProfile, getUser } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/env";

export const metadata: Metadata = { title: "Admin sign in", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  if (isSupabaseConfigured && (await getUser()) && (await getProfile())?.role === "admin") redirect("/admin/dashboard");

  return (
    <main id="main" className="blueprint-bg grid min-h-dvh place-items-center bg-ink px-4 py-12">
      <div className="w-full max-w-md border border-white/10 bg-white p-8 shadow-2xl sm:p-10">
        <Link href="/" className="relative mx-auto mb-8 block h-16 w-48">
          <Image src="/brand/logo-dark.png" alt="ARCHIAETIX" fill sizes="192px" className="object-contain" priority />
        </Link>
        <h1 className="font-serif text-3xl">Admin sign in</h1>
        <p className="mb-8 mt-2 text-sm text-neutral-600">Enter the admin email and password to manage the studio site.</p>
        <AdminLoginForm error={error} />
        <Link href="/" className="mt-8 block text-center text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500 hover:text-ink">Back to site</Link>
      </div>
    </main>
  );
}
