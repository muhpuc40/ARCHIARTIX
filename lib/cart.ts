"use client";

import { useSyncExternalStore } from "react";
import type { CartLine } from "@/lib/types";

/**
 * Client-side cart persisted in localStorage, exposed as an external store
 * (useSyncExternalStore) so it is hydration-safe and syncs across tabs.
 */
const KEY = "archiartix-cart-v1";
const EMPTY: CartLine[] = [];
const MAX_QTY = 99;

let snapshot: { raw: string | null; items: CartLine[] } = { raw: null, items: EMPTY };
const listeners = new Set<() => void>();

function isLine(v: unknown): v is CartLine {
  const l = v as CartLine;
  return (
    !!l &&
    typeof l.productId === "string" &&
    typeof l.slug === "string" &&
    typeof l.name === "string" &&
    Number.isFinite(l.price) &&
    Number.isInteger(l.qty) &&
    l.qty > 0 &&
    Number.isFinite(l.stock)
  );
}

function read(): CartLine[] {
  if (typeof window === "undefined") return EMPTY;
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(KEY);
  } catch {
    return snapshot.items;
  }
  if (raw === snapshot.raw) return snapshot.items;
  let items: CartLine[] = EMPTY;
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) items = parsed.filter(isLine);
    } catch {
      /* corrupted — start fresh */
    }
  }
  snapshot = { raw, items };
  return items;
}

function write(items: CartLine[]) {
  const raw = JSON.stringify(items);
  try {
    window.localStorage.setItem(KEY, raw);
  } catch {
    /* storage unavailable (private mode) — keep in memory only */
  }
  snapshot = { raw, items };
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) cb();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

export function useCartItems(): CartLine[] {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

export const cartCount = (items: CartLine[]) => items.reduce((n, l) => n + l.qty, 0);
export const cartTotal = (items: CartLine[]) => items.reduce((n, l) => n + l.qty * l.price, 0);

export const cart = {
  /** Adds a product, never exceeding stock. Returns how many were actually added. */
  add(line: Omit<CartLine, "qty">, qty = 1): { added: number; limited: boolean } {
    const items = read();
    const existing = items.find((l) => l.productId === line.productId);
    const limit = Math.min(Math.max(line.stock, 0), MAX_QTY);
    const current = existing?.qty ?? 0;
    const next = Math.min(current + qty, limit);
    const added = next - current;
    if (added <= 0) return { added: 0, limited: true };
    const updated = existing
      ? items.map((l) => (l.productId === line.productId ? { ...l, ...line, qty: next } : l))
      : [...items, { ...line, qty: next }];
    write(updated);
    return { added, limited: next < current + qty };
  },
  setQty(productId: string, qty: number) {
    const items = read();
    if (qty <= 0) return write(items.filter((l) => l.productId !== productId));
    write(
      items.map((l) =>
        l.productId === productId ? { ...l, qty: Math.min(qty, l.stock, MAX_QTY) } : l,
      ),
    );
  },
  remove(productId: string) {
    write(read().filter((l) => l.productId !== productId));
  },
  clear() {
    write([]);
  },
};

export type CartSyncReport = { removed: string[]; priceChanged: string[]; reduced: string[] };

/**
 * Reconciles the local cart with the live catalogue: drops products that were
 * removed or unpublished, refreshes prices, and clamps quantities to stock.
 */
let syncing = false;

export async function syncCartWithServer(): Promise<CartSyncReport | null> {
  const items = read();
  if (items.length === 0 || syncing) return null;
  syncing = true;
  try {
    return await reconcile(items);
  } finally {
    syncing = false;
  }
}

async function reconcile(items: CartLine[]): Promise<CartSyncReport | null> {
  let products: { id: string; name: string; slug: string; price_bdt: number; stock: number; image: string | null }[];
  try {
    const res = await fetch("/api/cart/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: items.map((l) => l.productId) }),
    });
    if (!res.ok) return null;
    products = (await res.json()).products ?? [];
  } catch {
    return null;
  }

  const report: CartSyncReport = { removed: [], priceChanged: [], reduced: [] };
  const next: CartLine[] = [];

  for (const line of items) {
    const p = products.find((x) => x.id === line.productId);
    if (!p || p.stock <= 0) {
      report.removed.push(line.name);
      continue;
    }
    let qty = line.qty;
    if (qty > p.stock) {
      qty = p.stock;
      report.reduced.push(p.name);
    }
    if (p.price_bdt !== line.price) report.priceChanged.push(p.name);
    next.push({ ...line, name: p.name, slug: p.slug, price: p.price_bdt, stock: p.stock, image: p.image, qty });
  }

  if (JSON.stringify(next) !== JSON.stringify(items)) write(next);
  return report;
}
