"use client";

import Link from "next/link";
import Image from "next/image";
import { X, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/stores/cartStore";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQty, subtotal } = useCartStore();
  const total = subtotal();

  const CartContents = () => (
    <>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-[var(--color-primary-600)]" />
          <h2 className="font-bold text-lg text-[var(--color-text)]">Your Cart</h2>
          {items.length > 0 && (
            <span className="badge badge-primary text-xs">{items.length}</span>
          )}
        </div>
        <button onClick={closeCart} className="btn-ghost p-2 rounded-full">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Items */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
            <div className="w-20 h-20 rounded-full bg-[var(--color-primary-50)] flex items-center justify-center">
              <ShoppingBag className="w-9 h-9 text-[var(--color-primary-400)]" />
            </div>
            <div>
              <p className="font-semibold text-[var(--color-text)]">Your cart is empty</p>
              <p className="text-sm text-[var(--color-text-secondary)] mt-1">Add some products to get started</p>
            </div>
            <Button variant="secondary" onClick={closeCart} size="sm">
              Continue Shopping
            </Button>
          </div>
        ) : (
          <ul className="flex flex-col gap-4">
            {items.map((item) => (
              <li key={item.product_id} className="flex gap-3">
                {/* Image */}
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-[var(--color-surface-secondary)] shrink-0">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingBag className="w-6 h-6 text-[var(--color-text-muted)]" />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[var(--color-text)] truncate">{item.name}</p>
                  <p className="text-sm text-[var(--color-primary-600)] font-bold mt-0.5">{formatPrice(item.price)}</p>

                  {/* Qty controls */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQty(item.product_id, item.quantity - 1)}
                      className="w-7 h-7 rounded-full border border-[var(--color-border)] flex items-center justify-center hover:border-[var(--color-primary-500)] hover:text-[var(--color-primary-600)] transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-sm font-semibold w-5 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQty(item.product_id, item.quantity + 1)}
                      className="w-7 h-7 rounded-full border border-[var(--color-border)] flex items-center justify-center hover:border-[var(--color-primary-500)] hover:text-[var(--color-primary-600)] transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeItem(item.product_id)}
                  className="text-[var(--color-text-muted)] hover:text-[var(--color-error)] transition-colors shrink-0 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Footer */}
      {items.length > 0 && (
        <div className="px-5 py-4 border-t border-[var(--color-border)] bg-[var(--color-surface-secondary)] pb-safe-bottom">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-[var(--color-text-secondary)]">Subtotal</span>
            <span className="font-bold text-lg text-[var(--color-text)]">{formatPrice(total)}</span>
          </div>
          <p className="text-xs text-[var(--color-text-secondary)] mb-3 text-center">
            Delivery calculated at checkout
          </p>
          <Link href="/checkout" onClick={closeCart}>
            <Button variant="primary" className="w-full" size="md">
              Checkout — {formatPrice(total)}
            </Button>
          </Link>
          <button
            onClick={closeCart}
            className="w-full mt-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors py-2"
          >
            Continue Shopping
          </button>
        </div>
      )}
    </>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeCart}
          />

          {/* Mobile: bottom sheet */}
          <motion.div
            key="mobile-sheet"
            className="fixed bottom-0 left-0 right-0 h-[85vh] bg-white z-50 flex flex-col shadow-2xl rounded-t-3xl md:hidden"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1 shrink-0">
              <div className="w-12 h-1.5 bg-[var(--color-border-strong)] rounded-full" />
            </div>
            <CartContents />
          </motion.div>

          {/* Desktop: right side drawer */}
          <motion.div
            key="desktop-drawer"
            className="hidden md:flex fixed top-0 right-0 h-full w-full max-w-sm bg-white z-50 flex-col shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
          >
            <CartContents />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
