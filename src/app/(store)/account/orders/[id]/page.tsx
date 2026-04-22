import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { createServerClient, createAdminClient } from "@/lib/supabase/server";
import { formatPrice, formatDate, orderStatusMeta } from "@/lib/utils";
import { OrderStatusBadge } from "@/components/ui/badge";
import type { Order } from "@/types";
import { ArrowLeft, MapPin, Package, Truck, Store } from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/auth/login?next=/account/orders/${id}`);

  const adminClient = createAdminClient();
  const { data: order } = await adminClient
    .from("orders")
    .select("*, items:order_items(*, product:products(name, images, slug))")
    .eq("id", id)
    .eq("profile_id", user.id)
    .single();

  if (!order) notFound();

  const o = order as Order & { items: Array<{ id: string; product: { name: string; images: string[]; slug: string } | null; quantity: number; unit_price: number; total_price: number }> };

  const statusOrder = ["pending", "confirmed", "processing", "ready", "dispatched", "delivered"];
  const currentStep = statusOrder.indexOf(o.status);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/account/orders" className="p-2 rounded-lg hover:bg-[var(--color-surface-secondary)] transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">{o.order_number}</h1>
          <p className="text-sm text-[var(--color-text-secondary)]">Placed {formatDate(o.created_at)}</p>
        </div>
      </div>

      {/* Status badge */}
      <div className="card p-4 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {o.fulfillment_type === "delivery" ? (
            <Truck className="w-5 h-5 text-[var(--color-primary-600)]" />
          ) : (
            <Store className="w-5 h-5 text-[var(--color-primary-600)]" />
          )}
          <div>
            <p className="font-semibold text-sm capitalize">{o.fulfillment_type}</p>
            <p className="text-xs text-[var(--color-text-secondary)]">
              {o.fulfillment_type === "delivery" ? "Delivery to your address" : "Ready for collection"}
            </p>
          </div>
        </div>
        <OrderStatusBadge status={o.status} />
      </div>

      {/* Progress tracker (hide for cancelled) */}
      {o.status !== "cancelled" && (
        <div className="card p-5 mb-4">
          <div className="flex items-center gap-0">
            {statusOrder.slice(0, o.fulfillment_type === "delivery" ? 6 : 5).map((step, i, arr) => {
              const done = i <= currentStep;
              const last = i === arr.length - 1;
              return (
                <div key={step} className="flex-1 flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border-2 ${done ? "bg-[var(--color-primary-600)] border-[var(--color-primary-600)] text-white" : "border-[var(--color-border)] text-[var(--color-text-muted)]"}`}>
                      {done ? "✓" : i + 1}
                    </div>
                    <span className="text-[9px] mt-1 text-center text-[var(--color-text-muted)] capitalize leading-tight max-w-[40px]">{step}</span>
                  </div>
                  {!last && <div className={`h-0.5 flex-1 mx-1 ${i < currentStep ? "bg-[var(--color-primary-600)]" : "bg-[var(--color-border)]"}`} />}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Items */}
      <div className="card p-5 mb-4">
        <h2 className="font-semibold mb-3">Items</h2>
        <div className="flex flex-col gap-3">
          {o.items?.map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-[var(--color-surface-secondary)] shrink-0">
                {item.product?.images?.[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.product.images[0]} alt={item.product?.name} className="w-full h-full object-cover" />
                ) : (
                  <Package className="w-6 h-6 m-3 text-[var(--color-text-muted)]" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{item.product?.name ?? "Product"}</p>
                <p className="text-xs text-[var(--color-text-secondary)]">Qty: {item.quantity} × {formatPrice(item.unit_price)}</p>
              </div>
              <p className="font-bold text-sm shrink-0">{formatPrice(item.total_price)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Totals */}
      <div className="card p-5 mb-4">
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-[var(--color-text-secondary)]">Subtotal</span>
            <span>{formatPrice(o.subtotal)}</span>
          </div>
          {o.delivery_fee > 0 && (
            <div className="flex justify-between">
              <span className="text-[var(--color-text-secondary)]">Delivery fee</span>
              <span>{formatPrice(o.delivery_fee)}</span>
            </div>
          )}
          {o.discount > 0 && (
            <div className="flex justify-between text-success">
              <span>Discount</span>
              <span>-{formatPrice(o.discount)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-base border-t border-[var(--color-border)] pt-2 mt-1">
            <span>Total</span>
            <span className="text-[var(--color-primary-700)]">{formatPrice(o.total)}</span>
          </div>
        </div>
      </div>

      {/* Delivery address */}
      {o.delivery_address && o.fulfillment_type === "delivery" && (
        <div className="card p-5">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-[var(--color-primary-600)] shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold mb-1">Delivery address</p>
              <p className="text-sm text-[var(--color-text-secondary)]">{o.delivery_address.line1}</p>
              {o.delivery_address.line2 && <p className="text-sm text-[var(--color-text-secondary)]">{o.delivery_address.line2}</p>}
              {o.delivery_address.district && <p className="text-sm text-[var(--color-text-secondary)]">{o.delivery_address.district}, {o.delivery_address.province}</p>}
              {o.delivery_address.postal_code && <p className="text-sm text-[var(--color-text-secondary)]">{o.delivery_address.postal_code}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
