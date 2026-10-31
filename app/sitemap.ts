import type { MetadataRoute } from "next";
import { getProducts, getProjects, getServices } from "@/lib/data";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, services, products] = await Promise.all([getProjects(), getServices(), getProducts({ limit: 500 })]);
  const now = new Date();

  const fixed: [string, number][] = [
    ["/", 1],
    ["/about", 0.7],
    ["/about/team", 0.5],
    ["/about/mission-vision", 0.5],
    ["/projects", 0.9],
    ["/services", 0.9],
    ["/shop", 0.8],
    ["/contact", 0.8],
  ];
  const categories = Array.from(new Set(projects.map((p) => p.category?.slug).filter(Boolean))) as string[];

  return [
    ...fixed.map(([path, priority]) => ({ url: absoluteUrl(path), lastModified: now, priority })),
    ...categories.map((c) => ({ url: absoluteUrl(`/projects/${c}`), lastModified: now, priority: 0.7 })),
    ...projects.filter((p) => p.category?.slug).map((p) => ({ url: absoluteUrl(`/projects/${p.category!.slug}/${p.slug}`), lastModified: now, priority: 0.7 })),
    ...services.map((s) => ({ url: absoluteUrl(`/services/${s.slug}`), lastModified: now, priority: 0.8 })),
    ...products.map((p) => ({ url: absoluteUrl(`/shop/${p.slug}`), lastModified: now, priority: 0.6 })),
  ];
}
