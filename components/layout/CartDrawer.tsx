"use client";

import { ShoppingBag, Trash2 } from "lucide-react";
import Link from "next/link";
import { useUI } from "@/components/providers/UIProvider";
import { QuantityStepper } from "@/components/shop/QuantityStepper";
import { ButtonLink } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { SmartImage } from "@/components/ui/SmartImage";
import { cart, cartCount, cartTotal, useCartItems } from "@/lib/cart";
import { formatBDT } from "@/lib/format";

export function CartDrawer() {
  const { cartOpen, closeCart } = useUI();
  const items = useCartItems();
  const count = cartCount(items);

  return (
    <Drawer open={cartOpen} onClose={closeCart} label="Shopping cart">
      <div className="flex items-center gap-3 border-b border-line px-6 py-5">
        <ShoppingBag size={20} />
        <h2 className="font-sans text-lg font-bold">Your cart</h2>
        <span className="rounded-full bg-brand-yellow px-2.5 py-0.5 text-xs font-bold">{count}</span>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-5 px-8 text-center">
          <span className="grid h-20 w-20 place-items-center rounded-full bg-brand-cream">
            <ShoppingBag size={32} />
          </span>
          <p className="font-serif text-2xl">Your cart is empty</p>
          <p className="text-sm text-neutral-600">Browse our architecture & design products and add your favourites.</p>
          <ButtonLink href="/shop" onClick={closeCart}>
            Explore the Collection
          </ButtonLink>
        </div>
      ) : (
        <>
          <ul className="flex-1 divide-y divide-line overflow-y-auto px-6">
            {items.map((line) => (
              <li key={line.productId} className="flex gap-4 py-5">
                <Link
                  href={`/shop/${line.slug}`}
                  onClick={closeCart}
                  className="relative h-24 w-20 shrink-0 overflow-hidden bg-brand-cream"
                >
                  <SmartImage src={line.image} alt={line.name} seed={line.slug} tone="light" sizes="80px" />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  <Link href={`/shop/${line.slug}`} onClick={closeCart} className="line-clamp-2 text-sm font-semibold hover:underline">
                    {line.name}
                  </Link>
                  <p className="mt-1 text-sm text-neutral-600">{formatBDT(line.price)}</p>
                  <div className="mt-auto flex items-center justify-between pt-3">
                    <QuantityStepper
                      size="sm"
                      value={line.qty}
                      max={line.stock}
                      onChange={(n) => cart.setQty(line.productId, n)}
                      label={`Quantity for ${line.name}`}
                    />
                    <button
                      type="button"
                      onClick={() => cart.remove(line.productId)}
                      aria-label={`Remove ${line.name}`}
                      className="grid h-8 w-8 place-items-center text-neutral-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="space-y-4 border-t border-line bg-brand-cream px-6 py-6">
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-semibold uppercase tracking-[0.14em]">Subtotal</span>
              <span className="font-serif text-2xl font-bold">{formatBDT(cartTotal(items))}</span>
            </div>
            <p className="text-xs text-neutral-600">Delivery charge applicable — confirmed by our team. Pay with bKash, Nagad or Cash on Delivery.</p>
            <div className="grid grid-cols-2 gap-3">
              <ButtonLink href="/cart" variant="outline" onClick={closeCart}>
                View cart
              </ButtonLink>
              <ButtonLink href="/checkout" onClick={closeCart}>
                Checkout
              </ButtonLink>
            </div>
          </div>
        </>
      )}
    </Drawer>
  );
}
