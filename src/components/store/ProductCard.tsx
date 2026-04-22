"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, FileText, Plus, Zap } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import type { Product } from "@/types";
import { useCartStore } from "@/stores/cartStore";

interface ProductCardProps {
  product: Product;
  layout?: "grid" | "list";
}

function Stars({ rating, count }: { rating: number; count: number }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex">
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = i < full || (i === full && half);
          return (
            <svg key={i} className={`w-3.5 h-3.5 ${filled ? "star-filled" : "star-empty"}`} viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          );
        })}
      </div>
      <span className="text-[11px] cursor-pointer hover:underline" style={{ color: "var(--color-primary-600)" }}>({count.toLocaleString()})</span>
    </div>
  );
}

const MotionLink = motion.create(Link);

export function ProductCard({ product, layout = "grid" }: ProductCardProps) {
  const { addItem, openCart } = useCartStore();

  const image = product.images?.[0] ?? null;
  const discount =
    product.compare_price && product.compare_price > product.price
      ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
      : null;

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    if (product.stock_qty <= 0) return;
    addItem({
      product_id: product.id,
      name: product.name,
      slug: product.slug,
      image: image ?? "",
      price: product.price,
      quantity: 1,
      requires_prescription: product.requires_prescription,
    });
    openCart();
    toast.success(`Added to cart`, { description: product.name, duration: 2000 });
  }

  if (layout === "list") {
    return (
      <Link href={`/product/${product.slug}`}
        className="flex gap-4 p-4 rounded-xl transition-all"
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          boxShadow: "var(--shadow-card)",
        }}
        onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = "var(--shadow-card-hover)"; el.style.borderColor = "var(--color-primary-200)"; }}
        onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = "var(--shadow-card)"; el.style.borderColor = "var(--color-border)"; }}>
        <div className="relative w-28 h-28 shrink-0 rounded-xl overflow-hidden"
          style={{ background: "var(--color-surface-tertiary)" }}>
          {image ? (
            <Image src={image} alt={product.name} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ShoppingCart className="w-8 h-8" style={{ color: "var(--color-border-strong)" }} />
            </div>
          )}
          {discount && <span className="badge-deal absolute top-1 left-1">-{discount}%</span>}
        </div>
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            {product.category && (
              <p className="text-[11px] font-bold uppercase tracking-wide mb-0.5"
                style={{ color: "var(--color-primary-600)", fontFamily: "var(--font-sans)" }}>
                {product.category.name}
              </p>
            )}
            <h3 className="font-semibold text-sm leading-snug line-clamp-2 mb-1"
              style={{ color: "var(--color-text)", fontFamily: "var(--font-sans)" }}>
              {product.name}
            </h3>
            {product.avg_rating !== undefined && product.review_count !== undefined && (
              <Stars rating={product.avg_rating} count={product.review_count} />
            )}
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-baseline gap-1.5">
              <span className="font-bold text-base" style={{ color: "var(--color-text)" }}>
                ฿{product.price.toLocaleString()}
              </span>
              {product.compare_price && product.compare_price > product.price && (
                <span className="text-xs line-through" style={{ color: "var(--color-text-tertiary)" }}>
                  ฿{product.compare_price.toLocaleString()}
                </span>
              )}
            </div>
            {product.stock_qty > 0 ? (
              <button onClick={handleAddToCart}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:brightness-105 active:scale-95"
                style={{ background: "var(--color-primary-600)", color: "#fff" }}>
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            ) : (
              <span className="badge badge-gray">Out of Stock</span>
            )}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <MotionLink href={`/product/${product.slug}`}
      className="flex flex-col group overflow-hidden rounded-xl"
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        boxShadow: "var(--shadow-card)",
      }}
      whileHover={{ y: -4, boxShadow: "0 12px 32px rgba(8,145,178,0.18), 0 2px 8px rgba(0,0,0,0.08)" }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", damping: 22, stiffness: 320 }}>
      {/* Image */}
      <div className="relative aspect-square overflow-hidden"
        style={{ background: "var(--color-surface-secondary)" }}>
        {image ? (
          <Image src={image} alt={product.name} width={400} height={400}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingCart className="w-16 h-16" style={{ color: "var(--color-border-strong)" }} />
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {discount && <span className="badge-deal">Save {discount}%</span>}
          {product.requires_prescription && (
            <span className="badge badge-primary text-[10px] shadow-sm">
              <FileText className="w-2.5 h-2.5" /> Rx
            </span>
          )}
          {(product.review_count ?? 0) > 2000 && (
            <span className="badge-deal" style={{ background: "#b45309" }}>Best Seller</span>
          )}
        </div>

        {!product.requires_prescription && (
          <div className="absolute bottom-2 left-2">
            <span className="badge-express"><Zap className="w-2.5 h-2.5" />Express</span>
          </div>
        )}

        {product.stock_qty <= 0 && (
          <div className="absolute inset-0 flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.85)" }}>
            <span className="badge badge-gray text-sm">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-3.5">
        {product.category && (
          <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5"
            style={{ color: "var(--color-primary-600)", fontFamily: "var(--font-sans)" }}>
            {product.category.name}
          </p>
        )}
        <h3 className="text-sm font-medium leading-snug line-clamp-2 mb-1.5 flex-1"
          style={{ color: "var(--color-text)", fontFamily: "var(--font-sans)" }}>
          {product.name}
        </h3>

        {product.avg_rating !== undefined && product.review_count !== undefined && (
          <div className="mb-2">
            <Stars rating={product.avg_rating} count={product.review_count} />
          </div>
        )}

        {/* Price */}
        <div className="mb-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-bold" style={{ color: "var(--color-text)" }}>
              ฿{product.price.toLocaleString()}
            </span>
            {product.compare_price && product.compare_price > product.price && (
              <span className="text-xs line-through" style={{ color: "var(--color-text-tertiary)" }}>
                ฿{product.compare_price.toLocaleString()}
              </span>
            )}
          </div>
          {discount && (
            <p className="text-xs" style={{ color: "#b91c1c" }}>
              You save ฿{(product.compare_price! - product.price).toLocaleString()}
            </p>
          )}
        </div>

        <p className="text-[11px] font-medium mb-2.5" style={{ color: "#15803d" }}>
          {product.stock_qty > 0 && product.stock_qty <= product.low_stock_threshold
            ? `Only ${product.stock_qty} left`
            : product.stock_qty > 0
            ? "In Stock"
            : "Out of Stock"}
        </p>

        {product.stock_qty > 0 && (
          <button onClick={handleAddToCart}
            className="w-full py-2 rounded-lg text-sm font-semibold transition-all active:scale-95 flex items-center justify-center gap-1.5 text-white"
            style={{ background: "var(--color-primary-600)", boxShadow: "var(--shadow-button)" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--color-primary-700)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--color-primary-600)"; }}
            aria-label={`Add ${product.name} to cart`}>
            <Plus className="w-4 h-4" />
            Add to Cart
          </button>
        )}
      </div>
    </MotionLink>
  );
}
