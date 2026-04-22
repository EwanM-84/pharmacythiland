"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, ArrowRight } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function CartPage() {
  const { items, removeItem, updateQty, subtotal } = useCartStore();
  const total = subtotal();

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-20 text-center">
        <div className="card p-12 flex flex-col items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-[var(--color-primary-50)] flex items-center justify-center">
            <ShoppingBag className="w-12 h-12 text-[var(--color-primary-400)]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-text)] mb-2">Your cart is empty</h1>
            <p className="text-[var(--color-text-secondary)]">
              Looks like you haven&apos;t added anything yet.
            </p>
          </div>
          <Link href="/shop">
            <Button variant="primary" size="lg">
              <ShoppingBag className="w-5 h-5" />
              Browse Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/shop" className="btn-ghost p-2 rounded-xl">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="page-title">Your Cart</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">
            {items.reduce((sum, i) => sum + i.quantity, 0)} item{items.reduce((sum, i) => sum + i.quantity, 0) !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Items list */}
        <div className="lg:col-span-2">
          <div className="card overflow-hidden">
            <ul className="divide-y divide-[var(--color-border)]">
              {items.map((item) => (
                <li key={item.product_id} className="p-4 sm:p-5 flex gap-4">
                  {/* Image */}
                  <Link href={`/product/${item.slug}`}>
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-[var(--color-surface-secondary)] shrink-0">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="w-8 h-8 text-[var(--color-text-muted)]" />
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <Link
                          href={`/product/${item.slug}`}
                          className="font-semibold text-[var(--color-text)] hover:text-[var(--color-primary-600)] transition-colors line-clamp-2 text-sm sm:text-base"
                        >
                          {item.name}
                        </Link>
                        {item.requires_prescription && (
                          <span className="badge badge-warning text-[10px] mt-1 inline-block">Rx Required</span>
                        )}
                      </div>
                      {/* Remove button */}
                      <button
                        onClick={() => removeItem(item.product_id)}
                        className="text-[var(--color-text-muted)] hover:text-error transition-colors shrink-0 p-1 rounded-lg hover:bg-[var(--color-error-bg)]"
                        aria-label={`Remove ${item.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Qty controls */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQty(item.product_id, item.quantity - 1)}
                          className="w-8 h-8 rounded-lg border border-[var(--color-border)] flex items-center justify-center hover:border-[var(--color-primary-500)] hover:text-[var(--color-primary-600)] transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-bold w-6 text-center text-[var(--color-text)]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQty(item.product_id, item.quantity + 1)}
                          className="w-8 h-8 rounded-lg border border-[var(--color-border)] flex items-center justify-center hover:border-[var(--color-primary-500)] hover:text-[var(--color-primary-600)] transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Line total */}
                      <div className="text-right">
                        <p className="font-bold text-[var(--color-primary-700)]">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                        {item.quantity > 1 && (
                          <p className="text-xs text-[var(--color-text-muted)]">
                            {formatPrice(item.price)} each
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="card p-5 sticky top-24">
            <h2 className="font-bold text-lg text-[var(--color-text)] mb-4">Order Summary</h2>

            <div className="flex flex-col gap-2 text-sm pb-4 border-b border-[var(--color-border)]">
              {items.map((item) => (
                <div key={item.product_id} className="flex justify-between">
                  <span className="text-[var(--color-text-secondary)] truncate mr-2 max-w-[160px]">
                    {item.name} ×{item.quantity}
                  </span>
                  <span className="font-medium shrink-0">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--color-text-secondary)]">Subtotal</span>
                <span className="font-semibold">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-secondary)]">Delivery</span>
                <span className="text-[var(--color-text-muted)] text-xs italic">Calculated at checkout</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
              <div className="flex justify-between items-center mb-5">
                <span className="font-bold text-[var(--color-text)]">Estimated Total</span>
                <span className="font-extrabold text-xl text-[var(--color-primary-700)]">
                  {formatPrice(total)}
                </span>
              </div>

              <Link href="/checkout">
                <Button variant="primary" size="lg" className="w-full">
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/shop">
                <Button variant="ghost" size="sm" className="w-full mt-2">
                  Continue Shopping
                </Button>
              </Link>
            </div>

            <p className="text-xs text-[var(--color-text-muted)] text-center mt-4">
              Secure checkout · Free delivery over ฿500
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
