import { Pencil, Plus } from "lucide-react";
import Link from "next/link";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { ButtonLink } from "@/components/ui/Button";
import { SmartImage } from "@/components/ui/SmartImage";
import { requireAdmin } from "@/lib/auth";
import { formatBDT } from "@/lib/format";
import type { Product } from "@/lib/types";

export const metadata = { title: "Products" };

type Row = Omit<Product, "category"> & { categories: { name: string } | null };

export default async function AdminProductsPage({ searchParams }: { searchParams: Promise<{ q?: string; stock?: string }> }) {
  const { supabase } = await requireAdmin();
  const { q, stock } = await searchParams;

  let query = supabase.from("products").select("*, categories(name)").order("created_at", { ascending: false });
  const term = q?.trim().replace(/[%,()]/g, " ").slice(0, 60);
  if (term) query = query.ilike("name", `%${term}%`);
  if (stock === "low") query = query.lte("stock", 3);
  const { data } = await query;
  const rows = (data ?? []) as Row[];

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl">Products</h1>
          <p className="mt-1 text-sm text-neutral-600">{rows.length} shown{stock === "low" ? " · low stock only" : ""}</p>
        </div>
        <ButtonLink href="/admin/products/new"><Plus size={16} /> New product</ButtonLink>
      </header>

      <form className="flex flex-wrap gap-3" role="search">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search products…"
          aria-label="Search products"
          className="h-11 w-full max-w-xs rounded-[2px] border border-neutral-300 bg-white px-4 text-sm focus:border-ink focus:outline-none"
        />
        <select name="stock" defaultValue={stock ?? ""} aria-label="Stock filter" className="h-11 rounded-[2px] border border-neutral-300 bg-white px-3 text-sm">
          <option value="">All stock</option>
          <option value="low">Low stock (≤ 3)</option>
        </select>
        <button className="h-11 bg-ink px-6 text-xs font-semibold uppercase tracking-[0.12em] text-white hover:bg-charcoal">Filter</button>
      </form>

      <div className="overflow-x-auto border border-line bg-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-neutral-100 text-xs uppercase tracking-[0.1em] text-neutral-600">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-12 text-center text-neutral-500">No products found.</td></tr>
            )}
            {rows.map((p) => (
              <tr key={p.id} className="hover:bg-neutral-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden bg-neutral-200">
                      <SmartImage src={p.images?.[0]} alt="" seed={p.slug} sizes="48px" />
                    </div>
                    <Link href={`/admin/products/${p.id}/edit`} className="font-semibold hover:underline">{p.name}</Link>
                  </div>
                </td>
                <td className="px-4 py-3 text-neutral-600">{p.categories?.name ?? "—"}</td>
                <td className="px-4 py-3 font-semibold">{formatBDT(p.price_bdt)}</td>
                <td className={p.stock <= 3 ? "px-4 py-3 font-bold text-red-700" : "px-4 py-3"}>{p.stock}</td>
                <td className="px-4 py-3">
                  <span className={p.is_published ? "rounded-full bg-brand-yellow px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em]" : "rounded-full border border-neutral-300 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-500"}>
                    {p.is_published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/admin/products/${p.id}/edit`} aria-label={`Edit ${p.name}`} className="p-2 hover:bg-neutral-200"><Pencil size={16} /></Link>
                    <DeleteButton endpoint={`/api/products/${p.id}`} noun="Product" name={p.name} />
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
