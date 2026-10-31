import { notFound } from "next/navigation";
import { z } from "zod";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { requireAdmin } from "@/lib/auth";
import { getCategories } from "@/lib/data";

export const metadata = { title: "Edit project" };

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { supabase } = await requireAdmin();
  const { id } = await params;
  if (!z.string().uuid().safeParse(id).success) notFound();
  const [{ data: p }, categories] = await Promise.all([supabase.from("projects").select("*").eq("id", id).maybeSingle(), getCategories("project")]);
  if (!p) notFound();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-serif text-4xl">Edit project</h1>
        <DeleteButton endpoint={`/api/projects/${p.id}`} noun="Project" name={p.title} redirectTo="/admin/projects" />
      </div>
      <ProjectForm
        categories={categories}
        project={{
          id: p.id,
          defaults: {
            title: p.title,
            slug: p.slug,
            category_id: p.category_id,
            description: p.description ?? "",
            location: p.location ?? "",
            year: p.year,
            area_sqft: p.area_sqft,
            images: p.images?.length ? p.images : p.cover_image_url ? [p.cover_image_url] : [],
            featured: p.featured,
          },
        }}
      />
    </div>
  );
}
