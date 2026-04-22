import { Suspense } from "react";
import Link from "next/link";
import { ProductCard } from "@/components/store/ProductCard";
import { ProductCardSkeleton } from "@/components/ui/skeleton";
import { mockProducts, mockCategories, searchProducts, getProductsByCategory } from "@/lib/mock-products";
import type { Product } from "@/types";
import { SlidersHorizontal, ChevronRight, Search } from "lucide-react";

interface SearchParams { q?: string; category?: string; sort?: string; prescription?: string; min?: string; max?: string; }

function filterAndSort(params: SearchParams): Product[] {
  let products = params.q
    ? searchProducts(params.q)
    : params.category
    ? getProductsByCategory(params.category)
    : [...mockProducts];

  if (params.prescription === "true") products = products.filter((p) => p.requires_prescription);
  if (params.min) products = products.filter((p) => p.price >= Number(params.min));
  if (params.max) products = products.filter((p) => p.price <= Number(params.max));

  switch (params.sort) {
    case "price-asc":  products.sort((a, b) => a.price - b.price); break;
    case "price-desc": products.sort((a, b) => b.price - a.price); break;
    case "name-asc":   products.sort((a, b) => a.name.localeCompare(b.name)); break;
    case "rating":     products.sort((a, b) => (b.avg_rating ?? 0) - (a.avg_rating ?? 0)); break;
    default:           products.sort((a, b) => (b.review_count ?? 0) - (a.review_count ?? 0));
  }
  return products;
}

function ShopContent({ params }: { params: SearchParams }) {
  const products = filterAndSort(params);
  const activeCategory = mockCategories.find((c) => c.slug === params.category);

  return (
    <div className="flex gap-6">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col gap-4 w-52 shrink-0">
        {/* Categories */}
        <div className="rounded-xl overflow-hidden"
          style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", boxShadow: "var(--shadow-card)" }}>
          <div className="px-4 py-3" style={{ borderBottom: "1px solid var(--color-border)" }}>
            <h3 className="font-bold text-sm" style={{ color: "var(--color-text)", fontFamily: "var(--font-sans)" }}>Department</h3>
          </div>
          <ul className="py-2">
            <li>
              <Link href="/shop"
                className="block px-4 py-1.5 text-sm transition-colors"
                style={{ color: !params.category ? "var(--color-primary-700)" : "var(--color-text-secondary)", fontWeight: !params.category ? 700 : 400 }}>
                All Products
              </Link>
            </li>
            {mockCategories.map((cat) => (
              <li key={cat.id}>
                <Link href={`/shop/${cat.slug}`}
                  className="flex items-center justify-between px-4 py-1.5 text-sm transition-colors group"
                  style={{
                    color: params.category === cat.slug ? "var(--color-primary-700)" : "var(--color-text-secondary)",
                    fontWeight: params.category === cat.slug ? 700 : 400,
                    background: params.category === cat.slug ? "var(--color-primary-50)" : "transparent",
                  }}>
                  {cat.name}
                  <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "var(--color-primary-500)" }} />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Price filter */}
        <div className="rounded-xl p-4"
          style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", boxShadow: "var(--shadow-card)" }}>
          <h3 className="font-bold text-sm mb-3" style={{ color: "var(--color-text)", fontFamily: "var(--font-sans)" }}>Price Range</h3>
          <div className="flex gap-2">
            <input type="number" placeholder="Min ฿" defaultValue={params.min}
              className="w-full px-2 py-1.5 text-xs rounded-lg outline-none transition-all"
              style={{ border: "1.5px solid var(--color-border)", background: "var(--color-surface-secondary)", color: "var(--color-text)", fontFamily: "var(--font-sans)" }} />
            <input type="number" placeholder="Max ฿" defaultValue={params.max}
              className="w-full px-2 py-1.5 text-xs rounded-lg outline-none transition-all"
              style={{ border: "1.5px solid var(--color-border)", background: "var(--color-surface-secondary)", color: "var(--color-text)", fontFamily: "var(--font-sans)" }} />
          </div>
        </div>

        {/* Type */}
        <div className="rounded-xl p-4"
          style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", boxShadow: "var(--shadow-card)" }}>
          <h3 className="font-bold text-sm mb-3" style={{ color: "var(--color-text)", fontFamily: "var(--font-sans)" }}>Product Type</h3>
          <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: "var(--color-text-secondary)" }}>
            <input type="checkbox" className="w-4 h-4" style={{ accentColor: "var(--color-primary-600)" }} defaultChecked={params.prescription === "true"} />
            Prescription Required
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer mt-2" style={{ color: "var(--color-text-secondary)" }}>
            <input type="checkbox" className="w-4 h-4" style={{ accentColor: "var(--color-primary-600)" }} />
            In Stock Only
          </label>
        </div>

        {/* Rating filter */}
        <div className="rounded-xl p-4"
          style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", boxShadow: "var(--shadow-card)" }}>
          <h3 className="font-bold text-sm mb-3" style={{ color: "var(--color-text)", fontFamily: "var(--font-sans)" }}>Avg. Customer Review</h3>
          {[4, 3, 2, 1].map((stars) => (
            <label key={stars} className="flex items-center gap-2 text-sm cursor-pointer mb-1" style={{ color: "var(--color-text-secondary)" }}>
              <input type="radio" name="rating" style={{ accentColor: "var(--color-primary-600)" }} />
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} className={`w-3.5 h-3.5 ${i < stars ? "star-filled" : "star-empty"}`} viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span>& Up</span>
            </label>
          ))}
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0">
        {/* Toolbar */}
        <div className="rounded-xl px-4 py-3 mb-4 flex items-center justify-between gap-3 flex-wrap"
          style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", boxShadow: "var(--shadow-card)" }}>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 lg:hidden" style={{ color: "var(--color-text-tertiary)" }} />
            <p className="text-sm" style={{ color: "var(--color-text-secondary)", fontFamily: "var(--font-sans)" }}>
              {params.q && <span>Results for <strong style={{ color: "var(--color-text)" }}>&ldquo;{params.q}&rdquo;</strong> &mdash; </span>}
              {activeCategory && <span>in <strong style={{ color: "var(--color-text)" }}>{activeCategory.name}</strong> &mdash; </span>}
              <span className="font-semibold" style={{ color: "var(--color-text)" }}>{products.length.toLocaleString()} results</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm whitespace-nowrap" style={{ color: "var(--color-text-secondary)", fontFamily: "var(--font-sans)" }}>Sort by:</label>
            <select className="text-sm rounded-lg px-3 py-1.5 outline-none cursor-pointer"
              style={{ border: "1.5px solid var(--color-border)", background: "var(--color-surface-secondary)", color: "var(--color-text)", fontFamily: "var(--font-sans)" }}
              defaultValue={params.sort ?? "default"}>
              <option value="default">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Avg. Customer Review</option>
              <option value="name-asc">Name A–Z</option>
            </select>
          </div>
        </div>

        {/* Grid */}
        {products.length === 0 ? (
          <div className="rounded-xl p-16 flex flex-col items-center gap-4 text-center"
            style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", boxShadow: "var(--shadow-card)" }}>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: "var(--color-surface-tertiary)", color: "var(--color-primary-400)" }}>
              <Search className="w-8 h-8" />
            </div>
            <div>
              <p className="font-bold text-lg" style={{ color: "var(--color-text)", fontFamily: "var(--font-sans)" }}>No results found</p>
              <p className="text-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>Try adjusting your search or removing filters</p>
            </div>
            <Link href="/shop" className="px-5 py-2.5 rounded-xl text-white text-sm font-semibold"
              style={{ background: "var(--color-primary-600)" }}>
              View All Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
            {products.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}

interface PageProps { searchParams: Promise<SearchParams>; }

export default async function ShopPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const title = params.q ? `Search: "${params.q}"` : "All Products";

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6">
      <div className="mb-4">
        <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-2">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/shop" className="hover:text-blue-600">Shop</Link>
          {params.category && <>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-900 font-medium capitalize">{params.category.replace("-", " ")}</span>
          </>}
        </nav>
        <h1 className="page-title">{title}</h1>
      </div>
      <Suspense fallback={
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
        </div>
      }>
        <ShopContent params={params} />
      </Suspense>
    </div>
  );
}
