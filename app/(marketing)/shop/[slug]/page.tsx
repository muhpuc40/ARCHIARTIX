import { ShieldCheck, Truck, Wallet } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/marketing/PageHeader";
import { ProductCard } from "@/components/shop/ProductCard";
import { ProductGallery } from "@/components/shop/ProductGallery";
import { ProductPurchase } from "@/components/shop/ProductPurchase";
import { Container } from "@/components/ui/Container";
import { JsonLd } from "@/components/ui/JsonLd";
import { formatBDT } from "@/lib/format";
import { getProductBySlug, getProducts, getRelatedProducts } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";
import { absoluteUrl, siteConfig } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getProducts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProductBySlug(slug);
  if (!p) return {};
  return pageMetadata({
    title: p.name,
    description: `${p.description.slice(0, 130)} ${formatBDT(p.price_bdt)} — delivered across Bangladesh.`.trim(),
    path: `/shop/${p.slug}`,
    image: p.images[0],
  });
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();
  const related = await getRelatedProducts(product, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    sku: product.id,
    category: product.category?.name,
    image: product.images.length ? product.images : [absoluteUrl("/og.jpg")],
    brand: { "@type": "Brand", name: siteConfig.name },
    offers: {
      "@type": "Offer",
      url: absoluteUrl(`/shop/${product.slug}`),
      priceCurrency: "BDT",
      price: product.price_bdt,
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@id": `${siteConfig.url}/#business` },
    },
  };

  return (
    <>
      <PageHeader
        title={product.name}
        crumbs={[
          { name: "Shop", href: "/shop" },
          { name: product.name, href: `/shop/${product.slug}` },
        ]}
        compact
      />
      <section className="py-12 sm:py-20">
        <Container className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <ProductGallery images={product.images} name={product.name} slug={product.slug} />
          <div>
            {product.category && (
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-neutral-500">{product.category.name}</p>
            )}
            <p className="mt-3 font-serif text-4xl font-bold">{formatBDT(product.price_bdt)}</p>
            <p className="mt-6 text-lg leading-relaxed text-neutral-700">{product.description}</p>
            <div className="mt-8 border-y border-line py-8">
              <ProductPurchase product={product} />
            </div>
            <ul className="mt-8 space-y-4 text-sm">
              {[
                { Icon: Truck, text: "Delivery across all 64 districts — our team confirms charges and timing by phone." },
                { Icon: Wallet, text: "Pay on delivery available. Prices include VAT where applicable." },
                { Icon: ShieldCheck, text: "Every piece is checked by our studio before it ships." },
              ].map(({ Icon, text }) => (
                <li key={text} className="flex gap-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center bg-brand-yellow"><Icon size={18} /></span>
                  <span className="self-center text-neutral-700">{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {related.length > 0 && (
        <section className="bg-brand-cream py-16 sm:py-20">
          <Container>
            <h2 className="font-serif text-3xl">You may also like</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </Container>
        </section>
      )}
      <JsonLd data={jsonLd} />
    </>
  );
}
