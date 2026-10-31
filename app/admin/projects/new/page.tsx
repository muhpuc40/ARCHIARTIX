import { ProjectForm } from "@/components/admin/ProjectForm";
import { requireAdmin } from "@/lib/auth";
import { getCategories } from "@/lib/data";

export const metadata = { title: "New project" };

export default async function NewProjectPage() {
  await requireAdmin();
  const categories = await getCategories("project");
  return (
    <div className="space-y-6">
      <h1 className="font-serif text-4xl">New project</h1>
      <ProjectForm categories={categories} />
    </div>
  );
}
