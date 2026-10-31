"use client";

import { Check, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { useUI } from "@/components/providers/UIProvider";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { cart } from "@/lib/cart";
import type { Product } from "@/lib/types";

export function AddToCartButton({
  product,
  qty = 1,
  size = "md",
  className,
  openDrawer = true,
}: {
  product: Pick<Product, "id" | "slug" | "name" | "price_bdt" | "stock" | "images">;
  qty?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
  openDrawer?: boolean;
}) {
  const toast = useToast();
  const { openCart } = useUI();
  const [justAdded, setJustAdded] = useState(false);
  const soldOut = product.stock <= 0;

  function add() {
    const res = cart.add(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price_bdt,
        image: product.images[0] ?? null,
        stock: product.stock,
      },
      qty,
    );
    if (res.added === 0) {
      toast({ title: "Maximum quantity in cart", description: `Only ${product.stock} in stock.`, tone: "error" });
      return;
    }
    if (res.limited) toast({ title: "Limited by stock", description: `Added ${res.added}; that's all we have.` });
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1600);
    if (openDrawer) openCart();
  }

  return (
    <Button onClick={add} disabled={soldOut} size={size} className={className}>
      {soldOut ? "Sold out" : justAdded ? <><Check size={16} /> Added</> : <><ShoppingBag size={16} /> Add to cart</>}
    </Button>
  );
}
