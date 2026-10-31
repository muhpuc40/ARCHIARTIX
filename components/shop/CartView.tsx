"use client";

import { ArrowRight, ShoppingBag, Trash2 } from "lucide-react";
import Link from "next/link";
import { QuantityStepper } from "@/components/shop/QuantityStepper";
import { ButtonLink } from "@/components/ui/Button";
import { SmartImage } from "@/components/ui/SmartImage";
import { cart, cartCount, cartTotal, useCartItems } from "@/lib/cart";
import { formatBDT } from "@/lib/format";

export function CartView() {
  const items = useCartItems();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-5 border border-dashed border-neutral-300 py-24 text-center">
        <span className="grid h-20 w-20 place-items-center rounded-full bg-brand-cream"><ShoppingBag size={34} /></span>
        <p className="font-serif text-3xl">Your cart is empty</p>
        <p className="max-w-sm text-neutral-600">Add a few pieces from the shop and they’ll appear here.</p>
        <ButtonLink href="/shop">Browse the shop</ButtonLink>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr]">
      <ul className="divide-y divide-line border-y border-line">
        {items.map((l) => (
          <li key={l.productId} className="flex gap-5 py-6">
            <Link href={`/shop/${l.slug}`} className="relative h-28 w-24 shrink-0 overflow-hidden bg-brand-cream sm:h-32 sm:w-28">
              <SmartImage src={l.image} alt={l.name} seed={l.slug} tone="light" sizes="112px" />
            </Link>
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex items-start justify-between gap-4">
                <Link href={`/shop/${l.slug}`} className="font-semibold hover:underline">{l.name}</Link>
                <p className="shrink-0 font-serif text-lg font-bold">{formatBDT(l.price * l.qty)}</p>
              </div>
              <p className="mt-1 text-sm text-neutral-600">{formatBDT(l.price)} each</p>
              <div className="mt-auto flex items-center justify-between pt-4">
                <QuantityStepper value={l.qty} max={l.stock} onChange={(n) => cart.setQty(l.productId, n)} label={`Quantity for ${l.name}`} />
                <button type="button" onClick={() => cart.remove(l.productId)} className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-neutral-600 hover:text-red-700">
                  <Trash2 size={15} /> Remove
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <aside className="h-fit border-t-4 border-brand-yellow bg-brand-cream p-8 lg:sticky lg:top-28">
        <h2 className="font-sans text-xs font-bold uppercase tracking-[0.24em]">Order summary</h2>
        <dl className="mt-6 space-y-3 text-sm">
          <div className="flex justify-between"><dt>Items</dt><dd>{cartCount(items)}</dd></div>
          <div className="flex justify-between"><dt>Subtotal</dt><dd className="font-semibold">{formatBDT(cartTotal(items))}</dd></div>
          <div className="flex justify-between text-neutral-600"><dt>Delivery charge</dt><dd>Applicable · confirmed by phone</dd></div>
        </dl>
        <div className="mt-6 flex items-baseline justify-between border-t border-ink/15 pt-5">
          <span className="text-sm font-semibold uppercase tracking-[0.14em]">Total</span>
          <span className="font-serif text-3xl font-bold">{formatBDT(cartTotal(items))}</span>
        </div>
        <ButtonLink href="/checkout" size="lg" className="mt-6 w-full">
          Checkout <ArrowRight size={16} />
        </ButtonLink>
        <p className="mt-4 text-center text-xs text-neutral-600">bKash · Nagad · Cash on Delivery · Sign in to order</p>
      </aside>
    </div>
  );
}
