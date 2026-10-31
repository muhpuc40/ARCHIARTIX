import { notFound } from "next/navigation";
import { z } from "zod";
import { TestimonialForm } from "@/components/admin/TestimonialForm";
import { requireAdmin } from "@/lib/auth";

export const metadata = { title: "Edit testimonial" };

export default async function EditTestimonialPage({ params }: { params: Promise<{ id: string }> }) {
  const { supabase } = await requireAdmin();
  const { id } = await params;
  if (!z.string().uuid().safeParse(id).success) notFound();
  const { data: t } = await supabase.from("testimonials").select("*").eq("id", id).maybeSingle();
  if (!t) notFound();
  return (
    <div className="space-y-6">
      <h1 className="font-serif text-4xl">Edit testimonial</h1>
      <TestimonialForm
        id={t.id}
        defaults={{ name: t.name, role: t.role ?? "", location: t.location ?? "", quote: t.quote, rating: t.rating, avatar_url: t.avatar_url, is_published: t.is_published, sort_order: t.sort_order }}
      />
    </div>
  );
}
