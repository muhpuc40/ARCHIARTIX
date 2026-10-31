import { Pencil, Plus } from "lucide-react";
import Link from "next/link";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { ButtonLink } from "@/components/ui/Button";
import { SmartImage } from "@/components/ui/SmartImage";
import { requireAdmin } from "@/lib/auth";

export const metadata = { title: "Projects" };

type Row = { id: string; title: string; slug: string; cover_image_url: string | null; location: string | null; year: number | null; featured: boolean; categories: { name: string } | null };

export default async function AdminProjectsPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("projects").select("id, title, slug, cover_image_url, location, year, featured, categories(name)").order("created_at", { ascending: false });
  const rows = (data ?? []) as unknown as Row[];

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl">Projects</h1>
          <p className="mt-1 text-sm text-neutral-600">{rows.length} in the portfolio</p>
        </div>
        <ButtonLink href="/admin/projects/new"><Plus size={16} /> New project</ButtonLink>
      </header>
      <div className="overflow-x-auto border border-line bg-white">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-neutral-100 text-xs uppercase tracking-[0.1em] text-neutral-600">
            <tr><th className="px-4 py-3">Project</th><th className="px-4 py-3">Category</th><th className="px-4 py-3">Location</th><th className="px-4 py-3">Featured</th><th className="px-4 py-3 text-right">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.length === 0 && <tr><td colSpan={5} className="px-4 py-12 text-center text-neutral-500">No projects yet.</td></tr>}
            {rows.map((p) => (
              <tr key={p.id} className="hover:bg-neutral-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-16 shrink-0 overflow-hidden bg-neutral-200"><SmartImage src={p.cover_image_url} alt="" seed={p.slug} sizes="64px" /></div>
                    <Link href={`/admin/projects/${p.id}/edit`} className="font-semibold hover:underline">{p.title}</Link>
                  </div>
                </td>
                <td className="px-4 py-3 text-neutral-600">{p.categories?.name ?? "—"}</td>
                <td className="px-4 py-3 text-neutral-600">{p.location ?? "—"}{p.year ? ` · ${p.year}` : ""}</td>
                <td className="px-4 py-3">{p.featured ? <span className="rounded-full bg-brand-yellow px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em]">Featured</span> : "—"}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/admin/projects/${p.id}/edit`} aria-label={`Edit ${p.title}`} className="p-2 hover:bg-neutral-200"><Pencil size={16} /></Link>
                    <DeleteButton endpoint={`/api/projects/${p.id}`} noun="Project" name={p.title} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
