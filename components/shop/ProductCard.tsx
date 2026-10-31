import Link from "next/link";
import { AddToCartButton } from "@/components/shop/AddToCartButton";
import { SmartImage } from "@/components/ui/SmartImage";
import { formatBDT } from "@/lib/format";
import type { Product } from "@/lib/types";

export function ProductCard({ product, priority }: { product: Product; priority?: boolean }) {
  const soldOut = product.stock <= 0;
  const low = !soldOut && product.stock <= 3;
  return (
    <article className="group flex h-full flex-col border border-line bg-white transition-shadow duration-500 hover:shadow-[0_25px_60px_-25px_rgba(0,0,0,0.3)]">
      <Link href={`/shop/${product.slug}`} className="relative block aspect-square overflow-hidden bg-brand-cream">
        <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.07]">
          <SmartImage src={product.images[0]} alt={product.name} seed={product.slug} tone="light" priority={priority} />
        </div>
        {(soldOut || low) && (
          <span className="absolute left-3 top-3 bg-ink px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-brand-yellow">
            {soldOut ? "Sold out" : `Only ${product.stock} left`}
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-5">
        {product.category && (
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-500">{product.category.name}</p>
        )}
        <h3 className="mt-1.5 font-sans text-base font-bold leading-snug">
          <Link href={`/shop/${product.slug}`} className="hover:underline">{product.name}</Link>
        </h3>
        <p className="mt-2 font-serif text-xl font-bold">{formatBDT(product.price_bdt)}</p>
        <div className="mt-auto pt-4">
          <AddToCartButton product={product} size="sm" className="w-full" />
        </div>
      </div>
    </article>
  );
}
