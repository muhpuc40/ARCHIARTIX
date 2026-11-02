import type { Metadata } from "next";
import { AdminNav } from "@/components/admin/AdminNav";
import { getProfile, getUser } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/env";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | ARCHIARTIX Admin" },
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

/**
 * Shows the sidebar shell only for a verified admin. Everyone else gets the bare page
 * (that is how /admin/login renders). This layout is NOT a security boundary — layouts
 * don't re-run on client navigation — so every admin page calls requireAdmin() itself,
 * and proxy.ts redirects non-admins before they get here.
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = isSupabaseConfigured ? await getUser() : null;
  const profile = user ? await getProfile() : null;

  if (!user || profile?.role !== "admin") return <>{children}</>;

  return (
    <div className="flex min-h-dvh flex-col bg-neutral-50 lg:flex-row">
      <AdminNav name={profile.full_name ?? user.email ?? "Admin"} />
      <main id="main" className="min-w-0 flex-1 p-4 sm:p-8 lg:p-10">
        {children}
      </main>
    </div>
  );
}
