import { PackageSearch } from "lucide-react";
import { Suspense } from "react";
import { PageHeader } from "@/components/marketing/PageHeader";
import { ProductCard } from "@/components/shop/ProductCard";
import { ShopFilters } from "@/components/shop/ShopFilters";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { getCategories, getProducts, type ProductQuery } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Shop — Architecture & Design Products",
  description:
    "Shop lighting, furniture, décor, surfaces and studio tools curated by ARCHIARTIX. Prices in BDT, delivery across Bangladesh, pay on delivery available.",
  path: "/shop",
});

type Props = { searchParams: Promise<{ category?: string; q?: string; sort?: string }> };
const SORTS = ["newest", "price-asc", "price-desc", "name"] as const;

export default async function ShopPage({ searchParams }: Props) {
  const sp = await searchParams;
  const query: ProductQuery = {
    category: sp.category || undefined,
    q: sp.q?.slice(0, 60) || undefined,
    sort: (SORTS as readonly string[]).includes(sp.sort ?? "") ? (sp.sort as ProductQuery["sort"]) : "newest",
  };
  const [categories, products] = await Promise.all([getCategories("product"), getProducts(query)]);

  return (
    <>
      <PageHeader
        eyebrow="The shop"
        title="Design pieces, curated by our studio"
        text="Lighting, furniture, surfaces and tools we specify in our own projects — available to take home."
        crumbs={[{ name: "Shop", href: "/shop" }]}
        compact
      />
      <section className="py-12 sm:py-16">
        <Container className="space-y-10">
          <Suspense fallback={<div className="h-28" />}>
            <ShopFilters categories={categories} />
          </Suspense>

          <p className="text-sm text-neutral-600" aria-live="polite">
            {products.length} product{products.length === 1 ? "" : "s"}
          </p>

          {products.length === 0 ? (
            <div className="flex flex-col items-center gap-5 border border-dashed border-neutral-300 py-24 text-center">
              <PackageSearch size={44} className="text-neutral-400" />
              <p className="font-serif text-2xl">Nothing matches your search</p>
              <p className="max-w-sm text-sm text-neutral-600">Try a different keyword or clear the filters.</p>
              <ButtonLink href="/shop" variant="outline">Clear filters</ButtonLink>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((p, i) => (
                <ProductCard key={p.id} product={p} priority={i < 4} />
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
