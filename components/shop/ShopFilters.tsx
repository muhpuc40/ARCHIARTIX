"use client";

import { Search, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useRef } from "react";
import { Select } from "@/components/ui/Field";
import { cn } from "@/lib/utils";
import type { Category } from "@/lib/types";

export function ShopFilters({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const timer = useRef<number | undefined>(undefined);
  const active = params.get("category") ?? "";

  const hrefWith = (patch: Record<string, string | null>) => {
    const next = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(patch)) {
      if (v) next.set(k, v);
      else next.delete(k);
    }
    const qs = next.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  };

  function onSearch(value: string) {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      router.replace(hrefWith({ q: value.trim() || null }), { scroll: false });
    }, 350);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row">
        <form role="search" onSubmit={(e) => e.preventDefault()} className="relative flex-1">
          <label htmlFor="shop-search" className="sr-only">Search products</label>
          <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            id="shop-search"
            type="search"
            defaultValue={params.get("q") ?? ""}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search lamps, tables, materials…"
            className="h-12 w-full border border-neutral-300 bg-white pl-12 pr-4 text-sm focus:border-ink focus:outline-none"
          />
        </form>
        <div className="sm:w-56">
          <label htmlFor="shop-sort" className="sr-only">Sort products</label>
          <Select
            id="shop-sort"
            value={params.get("sort") ?? "newest"}
            onChange={(e) => router.replace(hrefWith({ sort: e.target.value === "newest" ? null : e.target.value }), { scroll: false })}
          >
            <option value="newest">Newest first</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="name">Name A–Z</option>
          </Select>
        </div>
      </div>

      <nav aria-label="Product categories" className="hide-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
        {[{ slug: "", name: "All" }, ...categories].map((c) => (
          <Link
            key={c.slug}
            href={hrefWith({ category: c.slug || null })}
            scroll={false}
            aria-current={c.slug === active ? "true" : undefined}
            className={cn(
              "shrink-0 border px-5 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition-colors",
              c.slug === active ? "border-ink bg-ink text-brand-yellow" : "border-neutral-300 hover:border-ink",
            )}
          >
            {c.name}
          </Link>
        ))}
        {(params.get("q") || active) && (
          <Link href={pathname} scroll={false} className="inline-flex shrink-0 items-center gap-1 px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-600 hover:text-ink">
            <X size={14} /> Clear
          </Link>
        )}
      </nav>
    </div>
  );
}
