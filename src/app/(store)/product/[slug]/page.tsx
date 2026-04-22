import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Truck, Clock, Shield, FileText, ChevronRight, Star, Package, RotateCcw } from "lucide-react";
import { ProductCard } from "@/components/store/ProductCard";
import { ProductGallery } from "./ProductGallery";
import { AddToCartButton } from "./AddToCartButton";
import { getProductBySlug, getRelatedProducts, mockProducts } from "@/lib/mock-products";

const fakeReviews = [
  { id: "r1", name: "Sarah M.", rating: 5, date: "12 April 2025", body: "Excellent product, arrived quickly and exactly as described. Will definitely order again." },
  { id: "r2", name: "James T.", rating: 5, date: "8 April 2025", body: "Great quality and fast delivery. The pharmacist even called to confirm my order — very professional." },
  { id: "r3", name: "Emma L.", rating: 4, date: "3 April 2025", body: "Good product, delivery was on time. Packaging was secure and professional." },
  { id: "r4", name: "David K.", rating: 5, date: "28 March 2025", body: "Impressed by the service. Ordered at noon and it arrived by 4pm the same day!" },
  { id: "r5", name: "Nattaya P.", rating: 5, date: "22 March 2025", body: "ดีมาก ราคาเหมาะสม จัดส่งเร็วมาก แนะนำเลย" },
];

interface Props { params: Promise<{ slug: string }>; }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  return {
    title: `${product.name} | Samui Home Clinic Pharmacy`,
    description: product.short_description ?? product.description ?? undefined,
  };
}

export async function generateStaticParams() {
  return mockProducts.map((p) => ({ slug: p.slug }));
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className={`w-4 h-4 ${i < Math.round(rating) ? "star-filled" : "star-empty"}`} viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related = getRelatedProducts(product, 4);
  const avgRating = product.avg_rating ?? 4.7;
  const reviewCount = product.review_count ?? 847;
  const discount = product.compare_price && product.compare_price > product.price
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : null;

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-6 flex-wrap">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/shop" className="hover:text-blue-600">Shop</Link>
        {product.category && (
          <>
            <ChevronRight className="w-3 h-3" />
            <Link href={`/shop/${product.category.slug}`} className="hover:text-blue-600">{product.category.name}</Link>
          </>
        )}
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-900 truncate max-w-[200px]">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-10 mb-14">
        {/* Gallery */}
        <ProductGallery images={product.images?.filter(Boolean) ?? []} productName={product.name} />

        {/* Details */}
        <div className="flex flex-col gap-5">
          {product.category && (
            <Link href={`/shop/${product.category.slug}`} className="text-xs font-bold text-blue-600 uppercase tracking-widest hover:underline">
              {product.category.name}
            </Link>
          )}

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5">
              <Stars rating={avgRating} />
              <span className="text-sm font-bold text-gray-900">{avgRating.toFixed(1)}</span>
            </div>
            <span className="text-sm text-blue-600 hover:underline cursor-pointer">{reviewCount.toLocaleString()} ratings</span>
            <span className="text-xs text-gray-400">|</span>
            <span className="text-xs text-gray-500">SKU: {product.sku ?? product.id.toUpperCase()}</span>
          </div>

          {/* Price */}
          <div className="py-3 border-t border-b border-gray-100">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-gray-900">฿{product.price.toLocaleString()}</span>
              {product.compare_price && product.compare_price > product.price && (
                <span className="text-lg text-gray-400 line-through">฿{product.compare_price.toLocaleString()}</span>
              )}
              {discount && (
                <span className="badge-deal">Save {discount}%</span>
              )}
            </div>
            {discount && (
              <p className="text-sm mt-1" style={{ color: "#CC0C39" }}>
                You save ฿{(product.compare_price! - product.price).toLocaleString()}
              </p>
            )}
            {!product.requires_prescription && (
              <div className="flex items-center gap-1.5 mt-2">
                <span className="badge-express text-[10px]">⚡ EXPRESS</span>
                <span className="text-xs text-gray-600">Order before 2pm for same-day delivery</span>
              </div>
            )}
          </div>

          {/* Prescription warning */}
          {product.requires_prescription && (
            <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
              <FileText className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-bold text-amber-800">Prescription Required</p>
                <p className="text-xs text-amber-700 mt-0.5">You will need to upload a valid prescription at checkout. Our pharmacist will verify before dispatch.</p>
              </div>
            </div>
          )}

          {/* Description */}
          {product.short_description && (
            <p className="text-gray-600 leading-relaxed text-sm">{product.short_description}</p>
          )}

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span key={tag} className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">{tag}</span>
              ))}
            </div>
          )}

          {/* Stock */}
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${product.stock_qty > 0 ? "bg-green-500" : "bg-red-500"}`} />
            <span className="text-sm font-semibold text-gray-700">
              {product.stock_qty > 0
                ? product.stock_qty <= product.low_stock_threshold
                  ? `Only ${product.stock_qty} left in stock — order soon`
                  : "In Stock"
                : "Currently Out of Stock"}
            </span>
          </div>

          {/* Add to cart */}
          <AddToCartButton product={product} />

          {/* Delivery / Trust */}
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 flex flex-col gap-3">
            {[
              { icon: <Truck className="w-4 h-4 text-blue-600" />, text: <>Free delivery on orders over <strong>฿500</strong></> },
              { icon: <Clock className="w-4 h-4 text-blue-600" />, text: <>Same-day delivery before <strong>2pm</strong> across Koh Samui</> },
              { icon: <Shield className="w-4 h-4 text-blue-600" />, text: "Licensed Thai FDA-registered pharmacy" },
              { icon: <RotateCcw className="w-4 h-4 text-blue-600" />, text: "30-day returns on unopened items" },
              { icon: <Package className="w-4 h-4 text-blue-600" />, text: "Discreet, secure packaging" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2.5 text-sm text-gray-600">{item.icon}{item.text}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="grid lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="font-bold text-lg text-gray-900 mb-4">Product Description</h2>
            <div className="text-gray-600 leading-relaxed text-sm whitespace-pre-line">
              {product.description ?? product.short_description ?? "No description available."}
            </div>
          </div>
        </div>
        <div>
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="font-bold text-base text-gray-900 mb-4">Product Details</h2>
            <dl className="flex flex-col gap-3">
              {[
                { label: "Brand", value: "Samui Pharmacy" },
                { label: "SKU", value: product.sku ?? product.id },
                { label: "Category", value: product.category?.name ?? "—" },
                { label: "Prescription", value: product.requires_prescription ? "Required" : "Not required" },
                { label: "In Stock", value: product.stock_qty > 0 ? "Yes" : "No" },
              ].map((row) => (
                <div key={row.label} className="flex justify-between text-sm border-b border-gray-50 pb-2">
                  <dt className="text-gray-500">{row.label}</dt>
                  <dd className="font-semibold text-gray-900 text-right">{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <section className="mb-12">
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-lg text-gray-900 flex items-center gap-2">
              <Star className="w-5 h-5 star-filled" />
              Customer Reviews
              <span className="text-sm font-normal text-gray-500">({reviewCount.toLocaleString()})</span>
            </h2>
            <div className="flex items-center gap-2">
              <Stars rating={avgRating} />
              <span className="font-bold text-gray-900">{avgRating.toFixed(1)} / 5</span>
            </div>
          </div>

          {/* Rating breakdown */}
          <div className="px-6 py-4 border-b border-gray-100 grid sm:grid-cols-2 gap-4">
            {[5,4,3,2,1].map((s) => {
              const pct = s === 5 ? 68 : s === 4 ? 21 : s === 3 ? 7 : s === 2 ? 2 : 2;
              return (
                <div key={s} className="flex items-center gap-2">
                  <span className="text-xs text-gray-600 w-4">{s}</span>
                  <svg className="w-3.5 h-3.5 star-filled shrink-0" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div className="h-2 rounded-full" style={{ width: `${pct}%`, background: "#FF9900" }} />
                  </div>
                  <span className="text-xs text-gray-500 w-8 text-right">{pct}%</span>
                </div>
              );
            })}
          </div>

          <ul className="divide-y divide-gray-50">
            {fakeReviews.map((r) => (
              <li key={r.id} className="px-6 py-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-bold text-blue-700">
                      {r.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{r.name}</p>
                      <p className="text-xs text-gray-500">{r.date}</p>
                    </div>
                  </div>
                  <Stars rating={r.rating} />
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{r.body}</p>
                <div className="flex items-center gap-3 mt-3">
                  <button className="text-xs text-gray-500 hover:text-blue-600 transition-colors">Helpful (12)</button>
                  <span className="text-gray-300">|</span>
                  <button className="text-xs text-gray-500 hover:text-blue-600 transition-colors">Report</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Related products */}
      {related.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="section-title">You May Also Like</h2>
            {product.category && (
              <Link href={`/shop/${product.category.slug}`} className="text-sm font-semibold text-blue-600 hover:underline flex items-center gap-1">
                See all <ChevronRight className="w-4 h-4" />
              </Link>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
