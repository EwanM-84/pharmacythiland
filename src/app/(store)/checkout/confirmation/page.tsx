import Link from "next/link";
import { CheckCircle, Package, Truck, Store } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/server";
import { formatPrice, formatDate } from "@/lib/utils";
import type { Order } from "@/types";
import { Button } from "@/components/ui/button";
import { CheckoutSteps } from "@/components/store/CheckoutSteps";

interface PageProps {
  searchParams: Promise<{ order?: string }>;
}

export default async function ConfirmationPage({ searchParams }: PageProps) {
  const { order: orderNumber } = await searchParams;

  let order: Order | null = null;
  if (orderNumber) {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("orders")
      .select("*, items:order_items(*, product:products(name))")
      .eq("order_number", orderNumber)
      .single();
    order = data as Order | null;
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      <CheckoutSteps currentStep={4} />
      <div className="card p-8 flex flex-col items-center gap-5">
        <div className="w-20 h-20 rounded-full bg-[var(--color-success-bg)] flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-success" />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">Order Confirmed!</h1>
          {order && (
            <p className="text-[var(--color-text-secondary)] mt-1">
              Order number: <strong className="text-[var(--color-primary-600)]">{order.order_number}</strong>
            </p>
          )}
          <p className="text-[var(--color-text-secondary)] text-sm mt-2">
            A confirmation email has been sent to your email address.
          </p>
        </div>

        {order && (
          <div className="w-full bg-[var(--color-surface-secondary)] rounded-xl p-4 text-left">
            <div className="flex items-center gap-3 mb-3">
              {order.fulfillment_type === "collect" ? (
                <Store className="w-5 h-5 text-[var(--color-primary-600)]" />
              ) : (
                <Truck className="w-5 h-5 text-[var(--color-primary-600)]" />
              )}
              <p className="font-semibold text-sm">
                {order.fulfillment_type === "collect" ? "Click & Collect" : "Home Delivery"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Package className="w-5 h-5 text-[var(--color-primary-600)]" />
              <p className="font-bold text-[var(--color-primary-700)] text-base">{formatPrice(order.total)}</p>
            </div>
            {order.created_at && (
              <p className="text-xs text-[var(--color-text-secondary)] mt-2">Placed {formatDate(order.created_at)}</p>
            )}
          </div>
        )}

        <div className="flex flex-col gap-2 w-full">
          <Link href="/account/orders">
            <Button className="w-full">Track My Order</Button>
          </Link>
          <Link href="/shop">
            <Button variant="secondary" className="w-full">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
