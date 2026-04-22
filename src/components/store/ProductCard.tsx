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
      <span className="text-[11px] text-blue-600 hover:underline cursor-pointer">({count.toLocaleString()})</span>
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
        className="bg-white border border-[var(--color-border)] rounded-xl flex gap-4 p-4 hover:shadow-md transition-shadow">
        <div className="relative w-28 h-28 shrink-0 rounded-lg overflow-hidden bg-gray-50">
          {image ? (
            <Image src={image} alt={product.name} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ShoppingCart className="w-8 h-8 text-gray-300" />
            </div>
          )}
          {discount && <span className="badge-deal absolute top-1 left-1">-{discount}%</span>}
        </div>
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            {product.category && (
              <p className="text-[11px] text-[var(--color-ios-blue)] font-semibold uppercase tracking-wide mb-0.5">{product.category.name}</p>
            )}
            <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2 mb-1">{product.name}</h3>
            {product.avg_rating !== undefined && product.review_count !== undefined && (
              <Stars rating={product.avg_rating} count={product.review_count} />
            )}
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-baseline gap-1.5">
              <span className="font-bold text-gray-900 text-base">฿{product.price.toLocaleString()}</span>
              {product.compare_price && product.compare_price > product.price && (
                <span className="text-xs text-gray-400 line-through">฿{product.compare_price.toLocaleString()}</span>
              )}
            </div>
            {product.stock_qty > 0 ? (
              <button onClick={handleAddToCart}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white text-xs font-semibold transition-colors hover:brightness-110"
                style={{ background: "var(--color-ios-blue)" }}>
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
      className="bg-white border border-[var(--color-border)] rounded-xl flex flex-col group overflow-hidden"
      whileHover={{ y: -3, boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", damping: 22, stiffness: 320 }}>
      {/* Image */}
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        {image ? (
          <Image src={image} alt={product.name} width={400} height={400}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-16 h-16 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
        )}

        {/* Badges overlay */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {discount && <span className="badge-deal">Save {discount}%</span>}
          {product.requires_prescription && (
            <span className="badge badge-primary text-[10px] shadow-sm">
              <FileText className="w-2.5 h-2.5" /> Rx
            </span>
          )}
          {(product.review_count ?? 0) > 2000 && (
            <span className="badge-deal" style={{ background: "#FF6B35" }}>Best Seller</span>
          )}
        </div>

        {/* Express badge */}
        {!product.requires_prescription && (
          <div className="absolute bottom-2 left-2">
            <span className="badge-express"><Zap className="w-2.5 h-2.5" />Express</span>
          </div>
        )}

        {product.stock_qty <= 0 && (
          <div className="absolute inset-0 bg-white/85 flex items-center justify-center">
            <span className="badge badge-gray text-sm">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-3">
        {product.category && (
          <p className="text-[10px] text-[var(--color-ios-blue)] font-semibold uppercase tracking-wider mb-0.5">{product.category.name}</p>
        )}
        <h3 className="text-sm font-medium text-gray-900 leading-snug line-clamp-2 mb-1.5 flex-1">{product.name}</h3>

        {product.avg_rating !== undefined && product.review_count !== undefined && (
          <div className="mb-2">
            <Stars rating={product.avg_rating} count={product.review_count} />
          </div>
        )}

        {/* Price */}
        <div className="mb-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-bold text-gray-900">฿{product.price.toLocaleString()}</span>
            {product.compare_price && product.compare_price > product.price && (
              <span className="text-xs text-gray-400 line-through">฿{product.compare_price.toLocaleString()}</span>
            )}
          </div>
          {discount && (
            <p className="text-xs" style={{ color: "#CC0C39" }}>You save ฿{(product.compare_price! - product.price).toLocaleString()}</p>
          )}
        </div>

        <p className="text-[11px] text-green-700 font-medium mb-2">
          {product.stock_qty > 0 && product.stock_qty <= product.low_stock_threshold
            ? `Only ${product.stock_qty} left`
            : product.stock_qty > 0
            ? "In Stock"
            : "Out of Stock"}
        </p>

        {/* Add to cart */}
        {product.stock_qty > 0 && (
          <button onClick={handleAddToCart}
            className="w-full py-2 rounded-lg text-sm font-semibold transition-all hover:brightness-105 active:scale-95 flex items-center justify-center gap-1.5"
            style={{ background: "linear-gradient(180deg,#FFD814 0%,#F5A623 100%)", color: "#111", border: "1px solid #C8960C" }}
            aria-label={`Add ${product.name} to cart`}>
            <Plus className="w-4 h-4" />
            Add to Cart
          </button>
        )}
      </div>
    </MotionLink>
  );
}
