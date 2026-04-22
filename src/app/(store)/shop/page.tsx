import { Suspense } from "react";
import { createAdminClient } from "@/lib/supabase/server";
import { ProductCard } from "@/components/store/ProductCard";
import { ProductCardSkeleton } from "@/components/ui/skeleton";
import type { Product, Category } from "@/types";
import { Filter, SlidersHorizontal } from "lucide-react";

interface SearchParams {
  q?: string;
  category?: string;
  sort?: string;
  prescription?: string;
  min?: string;
  max?: string;
  page?: string;
}

async function ShopContent({ searchParams }: { searchParams: SearchParams }) {
  const supabase = createAdminClient();

  let query = supabase
    .from("products")
    .select("*, category:categories(id,name,slug)")
    .eq("is_active", true);

  if (searchParams.q) {
    query = query.ilike("name", `%${searchParams.q}%`);
  }
  if (searchParams.prescription === "true") {
    query = query.eq("requires_prescription", true);
  }
  if (searchParams.min) {
    query = query.gte("price", Number(searchParams.min));
  }
  if (searchParams.max) {
    query = query.lte("price", Number(searchParams.max));
  }

  const sortMap: Record<string, { col: string; asc: boolean }> = {
    "price-asc": { col: "price", asc: true },
    "price-desc": { col: "price", asc: false },
    "name-asc": { col: "name", asc: true },
    "newest": { col: "created_at", asc: false },
  };
  const sort = sortMap[searchParams.sort ?? "newest"] ?? sortMap["newest"];
  query = query.order(sort.col, { ascending: sort.asc });

  const { data: products } = await query.limit(48);
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .is("parent_id", null)
    .order("sort_order");

  return (
    <div className="flex gap-6">
      {/* Sidebar filters (desktop) */}
      <aside className="hidden lg:flex flex-col gap-6 w-56 shrink-0">
        <div className="card p-4">
          <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
            <Filter className="w-4 h-4 text-[var(--color-primary-600)]" />
            Categories
          </h3>
          <ul className="flex flex-col gap-1">
            <li>
              <a
                href="/shop"
                className="block text-sm px-2 py-1.5 rounded-lg hover:bg-[var(--color-primary-50)] hover:text-[var(--color-primary-700)] transition-colors"
              >
                All Products
              </a>
            </li>
            {(categories as Category[])?.map((cat) => (
              <li key={cat.id}>
                <a
                  href={`/shop/${cat.slug}`}
                  className="block text-sm px-2 py-1.5 rounded-lg hover:bg-[var(--color-primary-50)] hover:text-[var(--color-primary-700)] transition-colors"
                >
                  {cat.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="card p-4">
          <h3 className="font-semibold text-sm mb-3">Price Range</h3>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              defaultValue={searchParams.min}
              className="input-base text-sm py-2 w-full"
            />
            <input
              type="number"
              placeholder="Max"
              defaultValue={searchParams.max}
              className="input-base text-sm py-2 w-full"
            />
          </div>
        </div>

        <div className="card p-4">
          <h3 className="font-semibold text-sm mb-3">Type</h3>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" className="w-4 h-4 accent-[var(--color-primary-600)]" />
            Prescription required
          </label>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
          <p className="text-sm text-[var(--color-text-secondary)]">
            {searchParams.q && (
              <span>Results for <strong className="text-[var(--color-text)]">&quot;{searchParams.q}&quot;</strong> — </span>
            )}
            {(products as Product[])?.length ?? 0} products
          </p>

          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[var(--color-text-secondary)] lg:hidden" />
            <select
              className="input-base py-2 text-sm w-auto"
              defaultValue={searchParams.sort ?? "newest"}
            >
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name A–Z</option>
            </select>
          </div>
        </div>

        {/* Grid */}
        {!products || products.length === 0 ? (
          <div className="card p-16 flex flex-col items-center gap-4 text-center">
            <div className="text-5xl">🔍</div>
            <div>
              <p className="font-semibold text-[var(--color-text)]">No products found</p>
              <p className="text-sm text-[var(--color-text-secondary)] mt-1">Try adjusting your search or filters</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
            {(products as Product[]).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface PageProps {
  searchParams: Promise<SearchParams>;
}

export default async function ShopPage({ searchParams }: PageProps) {
  const params = await searchParams;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="page-title">
          {params.q ? `Search: "${params.q}"` : "All Products"}
        </h1>
      </div>

      <Suspense
        fallback={
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        }
      >
        <ShopContent searchParams={params} />
      </Suspense>
    </div>
  );
}
