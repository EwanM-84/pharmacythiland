import { notFound } from "next/navigation";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/server";
import type { Product, Review } from "@/types";
import { formatPrice, formatDate } from "@/lib/utils";
import { ProductCard } from "@/components/store/ProductCard";
import { ProductGallery } from "./ProductGallery";
import { AddToCartButton } from "./AddToCartButton";
import { Badge, StarRating } from "@/components/ui/badge";
import { Truck, Clock, Shield, FileText, ChevronRight } from "lucide-react";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getProduct(slug: string): Promise<Product | null> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("products")
    .select("*, category:categories(id,name,slug)")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();
  return data as Product | null;
}

async function getReviews(productId: string): Promise<Review[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("reviews")
    .select("*, profile:profiles(full_name)")
    .eq("product_id", productId)
    .eq("is_approved", true)
    .order("created_at", { ascending: false })
    .limit(10);
  return (data as Review[]) ?? [];
}

async function getRelated(categoryId: string | null, currentId: string): Promise<Product[]> {
  if (!categoryId) return [];
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("products")
    .select("*, category:categories(id,name,slug)")
    .eq("category_id", categoryId)
    .eq("is_active", true)
    .neq("id", currentId)
    .limit(4);
  return (data as Product[]) ?? [];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.short_description ?? product.description ?? undefined,
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const [reviews, related] = await Promise.all([
    getReviews(product.id),
    getRelated(product.category_id, product.id),
  ]);

  const avgRating = reviews.length
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : 0;

  const images = product.images?.filter(Boolean) ?? [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] mb-6 flex-wrap">
        <Link href="/" className="hover:text-[var(--color-primary-600)] transition-colors">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/shop" className="hover:text-[var(--color-primary-600)] transition-colors">Shop</Link>
        {product.category && (
          <>
            <ChevronRight className="w-3 h-3" />
            <Link href={`/shop/${product.category.slug}`} className="hover:text-[var(--color-primary-600)] transition-colors">
              {product.category.name}
            </Link>
          </>
        )}
        <ChevronRight className="w-3 h-3" />
        <span className="text-[var(--color-text-secondary)] truncate max-w-[180px]">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-10 mb-12">
        {/* Gallery */}
        <ProductGallery images={images} productName={product.name} />

        {/* Details */}
        <div className="flex flex-col gap-5">
          {product.category && (
            <p className="text-sm font-semibold text-[var(--color-primary-600)] uppercase tracking-wide">
              {product.category.name}
            </p>
          )}

          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-text)] leading-tight">
            {product.name}
          </h1>

          {reviews.length > 0 && (
            <StarRating rating={avgRating} count={reviews.length} />
          )}

          <div className="flex items-center gap-3">
            <span className="text-3xl font-extrabold text-[var(--color-primary-700)]">
              {formatPrice(product.price)}
            </span>
            {product.compare_price && product.compare_price > product.price && (
              <>
                <span className="text-xl text-[var(--color-text-muted)] line-through">
                  {formatPrice(product.compare_price)}
                </span>
                <Badge variant="error">
                  -{Math.round(((product.compare_price - product.price) / product.compare_price) * 100)}%
                </Badge>
              </>
            )}
          </div>

          {product.requires_prescription && (
            <div className="flex items-start gap-2.5 bg-[var(--color-warning-bg)] border border-amber-200 rounded-xl p-3">
              <FileText className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-amber-800">Prescription required</p>
                <p className="text-xs text-amber-700 mt-0.5">You will need to upload a valid prescription at checkout.</p>
              </div>
            </div>
          )}

          {product.short_description && (
            <p className="text-[var(--color-text-secondary)] leading-relaxed">{product.short_description}</p>
          )}

          {/* Product tag highlights */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="bg-[var(--color-primary-50)] text-[var(--color-primary-700)] rounded-full px-3 py-1 text-xs font-semibold"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Stock status */}
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${product.stock_qty > 0 ? "bg-[var(--color-success)]" : "bg-[var(--color-error)]"}`} />
            <span className="text-sm font-medium">
              {product.stock_qty > 0
                ? product.stock_qty <= product.low_stock_threshold
                  ? `Low stock — only ${product.stock_qty} left`
                  : "In stock"
                : "Out of stock"}
            </span>
          </div>

          <AddToCartButton product={product} />

          {/* Delivery info */}
          <div className="border border-[var(--color-border)] rounded-xl p-4 flex flex-col gap-3">
            <div className="flex items-center gap-2.5 text-sm">
              <Truck className="w-4 h-4 text-[var(--color-primary-600)]" />
              <span className="text-[var(--color-text-secondary)]">Free delivery on orders over <strong className="text-[var(--color-text)]">฿500</strong></span>
            </div>
            <div className="flex items-center gap-2.5 text-sm">
              <Clock className="w-4 h-4 text-[var(--color-primary-600)]" />
              <span className="text-[var(--color-text-secondary)]">Same-day delivery for orders before <strong className="text-[var(--color-text)]">14:00</strong></span>
            </div>
            <div className="flex items-center gap-2.5 text-sm">
              <Shield className="w-4 h-4 text-[var(--color-primary-600)]" />
              <span className="text-[var(--color-text-secondary)]">Licensed & Thai FDA-registered pharmacy</span>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      {product.description && (
        <section className="card p-6 mb-8">
          <h2 className="font-bold text-lg mb-4">Product Description</h2>
          <div className="text-[var(--color-text-secondary)] leading-relaxed whitespace-pre-line">
            {product.description}
          </div>
        </section>
      )}

      {/* Reviews */}
      <section className="mb-10">
        <h2 className="section-title mb-6">Customer Reviews ({reviews.length})</h2>
        {reviews.length === 0 ? (
          <div className="card p-8 text-center text-[var(--color-text-secondary)]">
            No reviews yet. Be the first to review this product.
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {reviews.map((review) => (
              <div key={review.id} className="card p-5">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-semibold text-sm">{review.profile?.full_name ?? "Customer"}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">{formatDate(review.created_at)}</p>
                  </div>
                  <StarRating rating={review.rating} />
                </div>
                {review.body && <p className="text-sm text-[var(--color-text-secondary)]">{review.body}</p>}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* You May Also Like */}
      {related.length > 0 && (
        <section>
          <h2 className="section-title mb-6">You May Also Like</h2>
          {/* Horizontal scroll on mobile, grid on desktop */}
          <div className="flex overflow-x-auto gap-4 pb-2 scrollbar-hide md:grid md:grid-cols-4 md:overflow-visible">
            {related.map((p) => (
              <div key={p.id} className="min-w-[200px] md:min-w-0">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
