import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/server";
import { ProductCard } from "@/components/store/ProductCard";
import { ProductCardSkeleton } from "@/components/ui/skeleton";
import type { Product, Category } from "@/types";
import Link from "next/link";
import type { Metadata } from "next";
import { Suspense } from "react";

interface Props {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ sort?: string; q?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: slug } = await params;
  const supabase = createAdminClient();
  const { data } = await supabase.from("categories").select("name, description").eq("slug", slug).single();
  if (!data) return {};
  const cat = data as { name: string; description: string | null };
  return {
    title: `${cat.name} | Samui Home Clinic Pharmacy`,
    description: cat.description ?? `Browse ${cat.name} at Samui Home Clinic Pharmacy`,
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { category: slug } = await params;
  const { sort, q } = await searchParams;
  const supabase = createAdminClient();

  const { data: category } = await supabase.from("categories").select("*").eq("slug", slug).single();
  if (!category) notFound();
  const cat = category as Category;

  const sortMap: Record<string, { col: string; asc: boolean }> = {
    "price-asc": { col: "price", asc: true },
    "price-desc": { col: "price", asc: false },
    "name-asc": { col: "name", asc: true },
    "newest": { col: "created_at", asc: false },
  };
  const sortOpt = sortMap[sort ?? "newest"] ?? sortMap["newest"];

  let query = supabase
    .from("products")
    .select("*, category:categories(id,name,slug)")
    .eq("is_active", true)
    .eq("category_id", cat.id)
    .order(sortOpt.col, { ascending: sortOpt.asc });

  if (q) query = query.ilike("name", `%${q}%`);

  const { data: products } = await query.limit(48);

  // Sibling categories
  const { data: siblings } = await supabase
    .from("categories")
    .select("id, name, slug")
    .is("parent_id", null)
    .order("sort_order");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-[var(--color-text-secondary)] mb-4 flex items-center gap-1.5">
        <Link href="/shop" className="hover:text-[var(--color-primary-600)]">All Products</Link>
        <span>/</span>
        <span className="font-semibold text-[var(--color-text)]">{cat.name}</span>
      </nav>

      <h1 className="page-title mb-6">{cat.name}</h1>
      {cat.description && <p className="text-[var(--color-text-secondary)] mb-6">{cat.description}</p>}

      {/* Category pills */}
      {siblings && siblings.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-6">
          {(siblings as Category[]).map((s) => (
            <Link
              key={s.id}
              href={`/shop/${s.slug}`}
              className={`text-sm px-3 py-1.5 rounded-full font-semibold transition-colors ${
                s.slug === slug
                  ? "bg-[var(--color-primary-600)] text-white"
                  : "bg-[var(--color-surface-secondary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-primary-50)] hover:text-[var(--color-primary-700)]"
              }`}
            >
              {s.name}
            </Link>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-[var(--color-text-secondary)]">{(products as Product[])?.length ?? 0} products</p>
        <form>
          <select
            name="sort"
            defaultValue={sort ?? "newest"}
            onChange={(e) => {
              const url = new URL(window.location.href);
              url.searchParams.set("sort", e.target.value);
              window.location.href = url.toString();
            }}
            className="input-base py-2 text-sm w-auto"
          >
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name A–Z</option>
          </select>
        </form>
      </div>

      <Suspense fallback={
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
        </div>
      }>
        {!products || products.length === 0 ? (
          <div className="card p-16 text-center">
            <p className="font-semibold text-[var(--color-text)]">No products in this category</p>
            <Link href="/shop" className="text-sm text-[var(--color-primary-600)] mt-2 block">Browse all products →</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
            {(products as Product[]).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </Suspense>
    </div>
  );
}
