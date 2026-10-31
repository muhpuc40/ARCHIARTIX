import { LogOut, PackageCheck, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { ProfileForm } from "@/components/auth/ProfileForm";
import { PageHeader } from "@/components/marketing/PageHeader";
import { Container } from "@/components/ui/Container";
import { getProfile, requireUser } from "@/lib/auth";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "My account", description: "Manage your ARCHIAETIX account.", path: "/account", noindex: true });
export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const user = await requireUser("/account");
  const profile = await getProfile();

  return (
    <>
      <PageHeader title="My account" crumbs={[{ name: "Account", href: "/account" }]} compact />
      <section className="py-12 sm:py-16">
        <Container className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div className="border border-line p-8 sm:p-10">
            <h2 className="font-serif text-3xl">Your details</h2>
            <p className="mb-8 mt-2 text-sm text-neutral-600">Signed in as <strong>{user.email}</strong></p>
            <ProfileForm defaults={{ full_name: profile?.full_name ?? "", phone: profile?.phone ?? "" }} />
          </div>
          <aside className="space-y-4">
            <Link href="/account/orders" className="group flex items-center gap-4 border border-line p-6 transition-colors hover:border-brand-yellow hover:bg-brand-yellow">
              <PackageCheck size={28} /><span><span className="block font-serif text-xl">My orders</span><span className="text-sm text-neutral-600 group-hover:text-ink/80">Track status and history</span></span>
            </Link>
            {profile?.role === "admin" && (
              <Link href="/admin/dashboard" className="flex items-center gap-4 bg-ink p-6 text-white transition-colors hover:bg-brand-yellow hover:text-ink">
                <ShieldCheck size={28} /><span><span className="block font-serif text-xl">Admin panel</span><span className="text-sm opacity-70">Products, orders, customers</span></span>
              </Link>
            )}
            <form action="/auth/signout" method="post">
              <button type="submit" className="flex w-full items-center gap-4 border border-line p-6 text-left transition-colors hover:border-ink">
                <LogOut size={28} /><span className="font-serif text-xl">Sign out</span>
              </button>
            </form>
          </aside>
        </Container>
      </section>
    </>
  );
}
