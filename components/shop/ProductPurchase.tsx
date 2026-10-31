"use client";

import { useState } from "react";
import { QuantityStepper } from "@/components/shop/QuantityStepper";
import { AddToCartButton } from "@/components/shop/AddToCartButton";
import { WhatsAppIcon } from "@/components/ui/Icons";
import { whatsappLink } from "@/lib/site";
import { formatBDT } from "@/lib/format";
import type { Product } from "@/lib/types";

export function ProductPurchase({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  const soldOut = product.stock <= 0;
  const max = Math.max(1, Math.min(product.stock, 99));

  const wa = whatsappLink(
    `Hi ARCHIAETIX, I'd like to order ${qty} × ${product.name} (${formatBDT(product.price_bdt * qty)}).`,
  );

  return (
    <div className="space-y-5">
      {!soldOut && (
        <div className="flex flex-wrap items-center gap-4">
          <QuantityStepper value={qty} max={max} onChange={(n) => setQty(Math.min(Math.max(n, 1), max))} />
          <span className="text-sm text-neutral-600">
            {product.stock <= 5 ? `Only ${product.stock} left` : "In stock"}
          </span>
        </div>
      )}
      <div className="flex flex-wrap gap-3">
        <AddToCartButton product={product} qty={qty} size="lg" className="flex-1 sm:flex-none sm:min-w-56" />
        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-14 items-center justify-center gap-2 rounded-[2px] border border-ink px-7 text-xs font-semibold uppercase tracking-[0.12em] transition-colors hover:bg-ink hover:text-brand-yellow"
        >
          <WhatsAppIcon size={18} /> Order on WhatsApp
        </a>
      </div>
    </div>
  );
}
