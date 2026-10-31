import { cache } from "react";
import { getPublicClient } from "@/lib/supabase/public";
import { seedCategories, seedProducts, seedProjects, seedServices, seedTestimonials } from "@/lib/seed-data";
import type { Category, Product, Project, Service, Testimonial } from "@/lib/types";

/**
 * Public data access. Reads go through the cookie-less anon client (so pages
 * can be statically rendered / ISR). When Supabase isn't configured yet — or a
 * query fails — the built-in sample content is returned so the site still
 * renders end-to-end.
 */

const CAT_JOIN = "category:categories(name, slug)";

let warned = false;
function warn(scope: string, error: unknown) {
  if (!warned) {
    warned = true;
    console.warn(
      `[ARCHIAETIX] Supabase query failed (${scope}); falling back to sample content.`,
      error instanceof Error ? error.message : error,
    );
  }
}

type Row = Record<string, unknown>;

const asProject = (r: Row): Project => ({
  ...(r as unknown as Project),
  images: (r.images as string[] | null) ?? [],
  category: (r.category as Project["category"]) ?? null,
});
const asProduct = (r: Row): Product => ({
  ...(r as unknown as Product),
  images: (r.images as string[] | null) ?? [],
  category: (r.category as Product["category"]) ?? null,
});
const asService = (r: Row): Service => ({
  ...(r as unknown as Service),
  features: (r.features as string[] | null) ?? [],
});

/* ------------------------------- categories ------------------------------- */
export const getCategories = cache(async (kind: Category["kind"]): Promise<Category[]> => {
  const db = getPublicClient();
  if (db) {
    const { data, error } = await db.from("categories").select("*").eq("kind", kind).order("name");
    if (!error && data) return data as Category[];
    warn("categories", error);
  }
  return seedCategories.filter((c) => c.kind === kind);
});

/* -------------------------------- projects -------------------------------- */
export const getProjects = cache(async (): Promise<Project[]> => {
  const db = getPublicClient();
  if (db) {
    const { data, error } = await db
      .from("projects")
      .select(`*, ${CAT_JOIN}`)
      .order("featured", { ascending: false })
      .order("created_at", { ascending: false });
    if (!error && data) return (data as Row[]).map(asProject);
    warn("projects", error);
  }
  return seedProjects;
});

export async function getProjectsByCategory(slug: string) {
  return (await getProjects()).filter((p) => p.category?.slug === slug);
}

export async function getFeaturedProjects(limit = 6) {
  const all = await getProjects();
  const featured = all.filter((p) => p.featured);
  return (featured.length >= 3 ? featured : all).slice(0, limit);
}

export async function getProjectBySlug(slug: string) {
  return (await getProjects()).find((p) => p.slug === slug) ?? null;
}

/* -------------------------------- services -------------------------------- */
export const getServices = cache(async (): Promise<Service[]> => {
  const db = getPublicClient();
  if (db) {
    const { data, error } = await db.from("services").select("*").order("sort_order");
    if (!error && data) return (data as Row[]).map(asService);
    warn("services", error);
  }
  return seedServices;
});

export async function getServiceBySlug(slug: string) {
  return (await getServices()).find((s) => s.slug === slug) ?? null;
}

/* ------------------------------ testimonials ------------------------------ */
export const getTestimonials = cache(async (): Promise<Testimonial[]> => {
  const db = getPublicClient();
  if (db) {
    const { data, error } = await db
      .from("testimonials")
      .select("*")
      .eq("is_published", true)
      .order("sort_order")
      .order("created_at", { ascending: false });
    // A connected database is the source of truth: an empty list means "show none".
    if (!error && data) return data as Testimonial[];
    warn("testimonials", error);
  }
  return seedTestimonials;
});

/* -------------------------------- products -------------------------------- */
export type ProductQuery = {
  category?: string;
  q?: string;
  sort?: "newest" | "price-asc" | "price-desc" | "name";
  limit?: number;
};

const cleanSearch = (q: string) => q.replace(/[%,()*\\_]/g, " ").trim().slice(0, 60);

function filterSeedProducts(query: ProductQuery) {
  let list = [...seedProducts];
  if (query.category) list = list.filter((p) => p.category?.slug === query.category);
  if (query.q) {
    const needle = query.q.toLowerCase();
    list = list.filter((p) => `${p.name} ${p.description}`.toLowerCase().includes(needle));
  }
  switch (query.sort) {
    case "price-asc": list.sort((a, b) => a.price_bdt - b.price_bdt); break;
    case "price-desc": list.sort((a, b) => b.price_bdt - a.price_bdt); break;
    case "name": list.sort((a, b) => a.name.localeCompare(b.name)); break;
  }
  return query.limit ? list.slice(0, query.limit) : list;
}

export async function getProducts(query: ProductQuery = {}): Promise<Product[]> {
  const db = getPublicClient();
  if (db) {
    let builder = db
      .from("products")
      .select(`*, ${CAT_JOIN}`)
      .eq("is_published", true);

    if (query.category) {
      const cats = await getCategories("product");
      const cat = cats.find((c) => c.slug === query.category);
      if (!cat) return [];
      builder = builder.eq("category_id", cat.id);
    }
    const search = query.q ? cleanSearch(query.q) : "";
    if (search) builder = builder.or(`name.ilike.%${search}%,description.ilike.%${search}%`);

    switch (query.sort) {
      case "price-asc": builder = builder.order("price_bdt", { ascending: true }); break;
      case "price-desc": builder = builder.order("price_bdt", { ascending: false }); break;
      case "name": builder = builder.order("name", { ascending: true }); break;
      default: builder = builder.order("created_at", { ascending: false });
    }
    if (query.limit) builder = builder.limit(query.limit);

    const { data, error } = await builder;
    if (!error && data) return (data as Row[]).map(asProduct);
    warn("products", error);
  }
  return filterSeedProducts(query);
}

export const getProductBySlug = cache(async (slug: string): Promise<Product | null> => {
  const db = getPublicClient();
  if (db) {
    const { data, error } = await db
      .from("products")
      .select(`*, ${CAT_JOIN}`)
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle();
    if (!error) return data ? asProduct(data as Row) : null;
    warn("product", error);
  }
  return seedProducts.find((p) => p.slug === slug) ?? null;
});

/** Used by the cart: returns only products that still exist and are published. */
export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  if (ids.length === 0) return [];
  const db = getPublicClient();
  if (db) {
    const { data, error } = await db
      .from("products")
      .select(`*, ${CAT_JOIN}`)
      .in("id", ids)
      .eq("is_published", true);
    if (!error && data) return (data as Row[]).map(asProduct);
    warn("products by id", error);
  }
  return seedProducts.filter((p) => ids.includes(p.id));
}

export async function getRelatedProducts(product: Product, limit = 4) {
  const sameCategory = await getProducts({ category: product.category?.slug, limit: limit + 1 });
  const related = sameCategory.filter((p) => p.id !== product.id);
  if (related.length >= limit) return related.slice(0, limit);
  const others = (await getProducts({ limit: limit + 4 })).filter(
    (p) => p.id !== product.id && !related.some((r) => r.id === p.id),
  );
  return [...related, ...others].slice(0, limit);
}
