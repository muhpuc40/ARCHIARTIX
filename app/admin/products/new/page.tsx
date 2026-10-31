import { ProductForm } from "@/components/admin/ProductForm";
import { requireAdmin } from "@/lib/auth";
import { getCategories } from "@/lib/data";

export const metadata = { title: "New product" };

export default async function NewProductPage() {
  await requireAdmin();
  const categories = await getCategories("product");
  return (
    <div className="space-y-6">
      <h1 className="font-serif text-4xl">New product</h1>
      <ProductForm categories={categories} />
    </div>
  );
}
