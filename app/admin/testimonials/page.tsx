import { Pencil, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { ButtonLink } from "@/components/ui/Button";
import { Stars } from "@/components/ui/Stars";
import { requireAdmin } from "@/lib/auth";
import type { Testimonial } from "@/lib/types";

export const metadata = { title: "Testimonials" };

export default async function AdminTestimonialsPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("testimonials").select("*").order("sort_order").order("created_at", { ascending: false });
  const items = (data ?? []) as Testimonial[];

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl">Testimonials</h1>
          <p className="mt-1 text-sm text-neutral-600">Shown in the “Kind words” section on the home page.</p>
        </div>
        <ButtonLink href="/admin/testimonials/new"><Plus size={16} /> Add testimonial</ButtonLink>
      </header>
      {items.length === 0 ? (
        <p className="border border-dashed border-neutral-300 py-20 text-center text-neutral-500">No testimonials yet — the home section is hidden until you add one.</p>
      ) : (
        <ul className="space-y-4">
          {items.map((t) => (
            <li key={t.id} className="flex flex-wrap items-start justify-between gap-4 border border-line bg-white p-5">
              {t.project_photo_url && (
                <div className="relative h-24 w-36 shrink-0 overflow-hidden bg-neutral-100">
                  <Image src={t.project_photo_url} alt={`Project photo for ${t.name}`} fill sizes="144px" className="object-cover" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="flex flex-wrap items-center gap-3 font-bold">
                  {t.name}
                  <Stars value={t.rating} size={14} className="text-brand-yellow-deep" />
                  {!t.is_published && <span className="rounded-full border border-neutral-300 px-3 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-neutral-500">Draft</span>}
                </p>
                <p className="text-xs text-neutral-500">{[t.role, t.location].filter(Boolean).join(" · ")}</p>
                <p className="mt-3 text-sm leading-relaxed text-neutral-700">“{t.quote}”</p>
              </div>
              <div className="flex items-center gap-2">
                <Link href={`/admin/testimonials/${t.id}/edit`} aria-label={`Edit ${t.name}`} className="p-2 hover:bg-neutral-200"><Pencil size={16} /></Link>
                <DeleteButton endpoint={`/api/testimonials/${t.id}`} noun="Testimonial" name={t.name} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
