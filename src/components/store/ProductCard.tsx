"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, FileText, Plus } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import type { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/stores/cartStore";
import { StarRating } from "@/components/ui/badge";

interface ProductCardProps {
  product: Product;
  layout?: "grid" | "list";
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
    toast.success(`${product.name} added to cart`);
  }

  if (layout === "list") {
    return (
      <MotionLink
        href={`/product/${product.slug}`}
        className="card-hover flex gap-4 p-4"
        whileHover={{ scale: 1.005 }}
        whileTap={{ scale: 0.995 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
      >
        {/* Image */}
        <div className="relative w-24 h-24 shrink-0 rounded-xl overflow-hidden bg-[var(--color-surface-secondary)]">
          {image ? (
            <Image src={image} alt={product.name} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ShoppingCart className="w-8 h-8 text-[var(--color-border-strong)]" />
            </div>
          )}
          {discount && (
            <span className="absolute top-1 left-1 badge badge-error text-[9px] px-1.5 py-0.5">-{discount}%</span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            {product.category && (
              <p className="text-xs text-[var(--color-primary-600)] font-medium mb-0.5 uppercase tracking-wide">
                {product.category.name}
              </p>
            )}
            <h3 className="font-semibold text-[var(--color-text)] text-sm leading-snug mb-1 line-clamp-2">
              {product.name}
            </h3>
            {product.avg_rating !== undefined && product.review_count !== undefined && (
              <StarRating rating={product.avg_rating} count={product.review_count} />
            )}
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[var(--color-primary-700)] text-base">
                {formatPrice(product.price)}
              </span>
              {product.compare_price && product.compare_price > product.price && (
                <span className="text-sm text-[var(--color-text-muted)] line-through">
                  {formatPrice(product.compare_price)}
                </span>
              )}
            </div>
            {product.stock_qty > 0 && (
              <button
                onClick={handleAddToCart}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--color-primary-600)] text-white text-xs font-semibold hover:bg-[var(--color-primary-500)] transition-colors shrink-0"
                aria-label={`Add ${product.name} to cart`}
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </button>
            )}
            {product.stock_qty <= 0 && (
              <span className="badge badge-gray text-xs">Out of Stock</span>
            )}
          </div>
        </div>
      </MotionLink>
    );
  }

  return (
    <MotionLink
      href={`/product/${product.slug}`}
      className="card-hover block group"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", damping: 20, stiffness: 300 }}
    >
      {/* Image */}
      <div className="relative overflow-hidden rounded-t-2xl">
        <div className="aspect-square bg-[var(--color-surface-secondary)] overflow-hidden">
          {image ? (
            <Image
              src={image}
              alt={product.name}
              width={400}
              height={400}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-16 h-16 text-[var(--color-border-strong)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
          )}
        </div>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {discount && (
            <span className="badge badge-error text-[10px]">-{discount}%</span>
          )}
          {product.requires_prescription && (
            <span className="badge bg-white/90 text-[var(--color-primary-700)] text-[10px] shadow-sm">
              <FileText className="w-2.5 h-2.5" />
              Rx
            </span>
          )}
        </div>

        {product.stock_qty <= 0 && (
          <div className="absolute inset-0 bg-white/85 flex items-center justify-center">
            <span className="badge badge-gray text-xs">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {product.category && (
          <p className="text-xs text-[var(--color-primary-600)] font-medium mb-1 uppercase tracking-wide">
            {product.category.name}
          </p>
        )}
        <h3 className="font-semibold text-[var(--color-text)] text-sm leading-snug mb-1.5 line-clamp-2">
          {product.name}
        </h3>

        {product.avg_rating !== undefined && product.review_count !== undefined && (
          <div className="mb-2">
            <StarRating rating={product.avg_rating} count={product.review_count} />
          </div>
        )}

        {/* Price row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[var(--color-primary-700)] text-base">
              {formatPrice(product.price)}
            </span>
            {product.compare_price && product.compare_price > product.price && (
              <span className="text-sm text-[var(--color-text-muted)] line-through">
                {formatPrice(product.compare_price)}
              </span>
            )}
          </div>

          {product.stock_qty > 0 && (
            <button
              onClick={handleAddToCart}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--color-primary-600)] text-white text-xs font-semibold hover:bg-[var(--color-primary-500)] active:scale-95 transition-all shrink-0"
              aria-label={`Add ${product.name} to cart`}
            >
              <Plus className="w-3.5 h-3.5" />
              Add
            </button>
          )}
        </div>

        {product.stock_qty > 0 && product.stock_qty <= product.low_stock_threshold && (
          <p className="text-xs text-[var(--color-warning)] mt-1.5 font-medium">
            Only {product.stock_qty} left
          </p>
        )}
      </div>
    </MotionLink>
  );
}
