import type { MetadataRoute } from "next";
import { createAdminClient } from "@/lib/supabase/server";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://samuihomeclinicpharmacy.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createAdminClient();

  const [{ data: products }, { data: categories }, { data: posts }] = await Promise.all([
    supabase.from("products").select("slug, updated_at").eq("is_active", true),
    supabase.from("categories").select("slug").is("parent_id", null),
    supabase.from("blog_posts").select("slug, published_at").eq("is_published", true),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), priority: 1 },
    { url: `${BASE_URL}/shop`, lastModified: new Date(), priority: 0.9 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), priority: 0.7 },
    { url: `${BASE_URL}/auth/login`, lastModified: new Date(), priority: 0.3 },
    { url: `${BASE_URL}/auth/register`, lastModified: new Date(), priority: 0.3 },
  ];

  const productRoutes: MetadataRoute.Sitemap = (products ?? []).map((p) => ({
    url: `${BASE_URL}/product/${p.slug}`,
    lastModified: new Date(p.updated_at),
    priority: 0.8,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = (categories ?? []).map((c) => ({
    url: `${BASE_URL}/shop/${c.slug}`,
    lastModified: new Date(),
    priority: 0.7,
  }));

  const blogRoutes: MetadataRoute.Sitemap = (posts ?? []).map((b) => ({
    url: `${BASE_URL}/blog/${b.slug}`,
    lastModified: b.published_at ? new Date(b.published_at) : new Date(),
    priority: 0.6,
  }));

  return [...staticRoutes, ...productRoutes, ...categoryRoutes, ...blogRoutes];
}
