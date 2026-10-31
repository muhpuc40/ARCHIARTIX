import { SiteMediaForm } from "@/components/admin/SiteMediaForm";
import { requireAdmin } from "@/lib/auth";
import { getSiteSettings } from "@/lib/data";

export const metadata = { title: "Landing 3D & video" };

export default async function AdminSiteMediaPage() {
  await requireAdmin();
  const settings = await getSiteSettings();
  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-serif text-4xl">Landing 3D &amp; video</h1>
        <p className="mt-1 max-w-2xl text-sm text-neutral-600">
          Shown in the “Walk through your space before it exists” section on the home page. The 3D view is the default tab; the video appears as a second tab.
        </p>
      </header>
      <SiteMediaForm initial={settings} />
    </div>
  );
}
