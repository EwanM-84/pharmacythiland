"use client";

import { useState } from "react";
import { ShoppingCart, Minus, Plus, Zap } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { Product } from "@/types";
import { useCartStore } from "@/stores/cartStore";
import { Button } from "@/components/ui/button";

export function AddToCartButton({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  const { addItem, openCart } = useCartStore();
  const router = useRouter();

  function handleAdd() {
    addItem({
      product_id: product.id,
      name: product.name,
      slug: product.slug,
      image: product.images?.[0] ?? "",
      price: product.price,
      quantity: qty,
      requires_prescription: product.requires_prescription,
    });
    openCart();
    toast.success(`${qty}× ${product.name} added to cart`);
  }

  function handleBuyNow() {
    addItem({
      product_id: product.id,
      name: product.name,
      slug: product.slug,
      image: product.images?.[0] ?? "",
      price: product.price,
      quantity: qty,
      requires_prescription: product.requires_prescription,
    });
    router.push("/checkout");
  }

  if (product.stock_qty <= 0) {
    return (
      <Button variant="ghost" disabled className="w-full">
        Out of Stock
      </Button>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-3">
        {/* Qty stepper */}
        <div className="flex items-center border border-[var(--color-border)] rounded-full overflow-hidden shrink-0">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="px-3 py-3 hover:bg-[var(--color-surface-tertiary)] transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="px-4 text-sm font-semibold min-w-[2.5rem] text-center">{qty}</span>
          <button
            onClick={() => setQty((q) => Math.min(product.stock_qty, q + 1))}
            className="px-3 py-3 hover:bg-[var(--color-surface-tertiary)] transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <Button onClick={handleAdd} className="flex-1">
          <ShoppingCart className="w-4 h-4" />
          Add to Cart
        </Button>
      </div>

      {/* Buy Now */}
      <button onClick={handleBuyNow} className="btn-buy-now w-full">
        <Zap className="w-4 h-4" />
        Buy Now
      </button>
    </div>
  );
}
