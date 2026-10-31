import { TestimonialForm } from "@/components/admin/TestimonialForm";
import { requireAdmin } from "@/lib/auth";

export const metadata = { title: "Add testimonial" };

export default async function NewTestimonialPage() {
  await requireAdmin();
  return (
    <div className="space-y-6">
      <h1 className="font-serif text-4xl">Add testimonial</h1>
      <TestimonialForm />
    </div>
  );
}
