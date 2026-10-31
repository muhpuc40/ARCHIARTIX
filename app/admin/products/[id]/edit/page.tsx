import { notFound } from "next/navigation";
import { z } from "zod";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { ProductForm } from "@/components/admin/ProductForm";
import { requireAdmin } from "@/lib/auth";
import { getCategories } from "@/lib/data";

export const metadata = { title: "Edit product" };

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { supabase } = await requireAdmin();
  const { id } = await params;
  if (!z.string().uuid().safeParse(id).success) notFound();

  const [{ data: p }, categories] = await Promise.all([
    supabase.from("products").select("*").eq("id", id).maybeSingle(),
    getCategories("product"),
  ]);
  if (!p) notFound();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-serif text-4xl">Edit product</h1>
        <DeleteButton endpoint={`/api/products/${p.id}`} noun="Product" name={p.name} redirectTo="/admin/products" />
      </div>
      <ProductForm
        categories={categories}
        product={{
          id: p.id,
          defaults: {
            name: p.name,
            slug: p.slug,
            description: p.description ?? "",
            category_id: p.category_id,
            price_bdt: p.price_bdt,
            stock: p.stock,
            images: p.images ?? [],
            model_url: p.model_url ?? null,
            is_published: p.is_published,
          },
        }}
      />
    </div>
  );
}
