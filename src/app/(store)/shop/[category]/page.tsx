import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/store/ProductCard";
import { mockCategories, getProductsByCategory } from "@/lib/mock-products";

interface Props {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ sort?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: slug } = await params;
  const cat = mockCategories.find((c) => c.slug === slug);
  if (!cat) return {};
  return {
    title: `${cat.name} | Samui Home Clinic Pharmacy`,
    description: cat.description ?? `Browse ${cat.name} at Samui Home Clinic Pharmacy`,
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { category: slug } = await params;
  const { sort } = await searchParams;
  const cat = mockCategories.find((c) => c.slug === slug);
  if (!cat) notFound();

  let products = getProductsByCategory(slug);
  switch (sort) {
    case "price-asc":  products.sort((a, b) => a.price - b.price); break;
    case "price-desc": products.sort((a, b) => b.price - a.price); break;
    case "name-asc":   products.sort((a, b) => a.name.localeCompare(b.name)); break;
    default:           products.sort((a, b) => (b.review_count ?? 0) - (a.review_count ?? 0));
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-4">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/shop" className="hover:text-blue-600">Shop</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-900 font-medium">{cat.name}</span>
      </nav>

      <h1 className="page-title mb-2">{cat.name}</h1>
      {cat.description && <p className="text-gray-500 text-sm mb-5">{cat.description}</p>}

      {/* Category pills */}
      <div className="flex gap-2 flex-wrap mb-6">
        <Link href="/shop"
          className="px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-700 transition-colors">
          All Products
        </Link>
        {mockCategories.map((c) => (
          <Link key={c.id} href={`/shop/${c.slug}`}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${c.slug === slug ? "text-white" : "bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-700"}`}
            style={c.slug === slug ? { background: "var(--color-ios-blue)" } : {}}>
            {c.name}
          </Link>
        ))}
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-xl border border-gray-200 px-4 py-3 mb-5 flex items-center justify-between">
        <p className="text-sm text-gray-600"><strong className="text-gray-900">{products.length}</strong> products in {cat.name}</p>
        <select defaultValue={sort ?? "default"}
          className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:border-blue-400">
          <option value="default">Best Sellers</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name-asc">Name A–Z</option>
        </select>
      </div>

      {products.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
          <p className="font-bold text-gray-900">No products in this category</p>
          <Link href="/shop" className="text-sm text-blue-600 hover:underline mt-2 block">Browse all products →</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
