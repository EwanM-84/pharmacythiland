"use client";

import { useState } from "react";
import { ShoppingCart, Minus, Plus, Zap } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { Product } from "@/types";
import { useCartStore } from "@/stores/cartStore";
import { useLanguageStore } from "@/stores/languageStore";

export function AddToCartButton({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  const { addItem, openCart } = useCartStore();
  const { t } = useLanguageStore();
  const router = useRouter();

  function handleAdd() {
    addItem({ product_id: product.id, name: product.name, slug: product.slug, image: product.images?.[0] ?? "", price: product.price, quantity: qty, requires_prescription: product.requires_prescription });
    openCart();
    toast.success(`${qty}× ${product.name} added to cart`);
  }

  function handleBuyNow() {
    addItem({ product_id: product.id, name: product.name, slug: product.slug, image: product.images?.[0] ?? "", price: product.price, quantity: qty, requires_prescription: product.requires_prescription });
    router.push("/checkout");
  }

  if (product.stock_qty <= 0) {
    return (
      <button disabled className="w-full py-3 rounded-xl font-bold text-gray-400 bg-gray-100 border border-gray-200 cursor-not-allowed">
        {t.outOfStock}
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-3">
        {/* Qty stepper */}
        <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden shrink-0">
          <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3 py-3 hover:bg-gray-100 transition-colors">
            <Minus className="w-4 h-4" />
          </button>
          <span className="px-4 text-sm font-bold min-w-[2.5rem] text-center">{qty}</span>
          <button onClick={() => setQty((q) => Math.min(product.stock_qty, q + 1))} className="px-3 py-3 hover:bg-gray-100 transition-colors">
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <button onClick={handleAdd}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white text-sm transition-all active:scale-97"
          style={{ background: "var(--color-primary-600)", boxShadow: "var(--shadow-button)" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--color-primary-700)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--color-primary-600)"; }}>
          <ShoppingCart className="w-4 h-4" /> {t.addToCart}
        </button>
      </div>

      <button onClick={handleBuyNow}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all hover:brightness-95 active:scale-97"
        style={{ background: "var(--color-primary-500)", color: "#fff", boxShadow: "var(--shadow-button)" }}>
        <Zap className="w-4 h-4" /> {t.buyNow}
      </button>
    </div>
  );
}
