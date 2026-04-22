import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/server";
import { formatPrice, formatDate } from "@/lib/utils";
import { OrderStatusBadge } from "@/components/ui/badge";
import type { Order } from "@/types";
import { OrderStatusUpdater } from "./OrderStatusUpdater";
import { ArrowLeft, Truck, Store, FileText } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = createAdminClient();

  const { data } = await supabase
    .from("orders")
    .select("*, items:order_items(*, product:products(name,sku,images)), profile:profiles(full_name,phone), payment:payments(*)")
    .eq("id", id)
    .single();

  if (!data) notFound();
  const order = data as unknown as Order;

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/orders" className="btn-ghost p-2 rounded-xl">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl font-bold">{order.order_number}</h1>
          <p className="text-sm text-[var(--color-text-secondary)]">{formatDate(order.created_at)}</p>
        </div>
        <div className="ml-auto">
          <OrderStatusBadge status={order.status} />
        </div>
      </div>

      <div className="grid gap-4">
        {/* Customer */}
        <div className="card p-4">
          <h2 className="font-bold text-sm mb-3">Customer</h2>
          <p className="font-medium">{(order.profile as { full_name: string | null } | null)?.full_name ?? "Unknown"}</p>
          <p className="text-sm text-[var(--color-text-secondary)]">{(order.profile as { phone: string | null } | null)?.phone ?? "—"}</p>
        </div>

        {/* Fulfillment */}
        <div className="card p-4">
          <h2 className="font-bold text-sm mb-3 flex items-center gap-2">
            {order.fulfillment_type === "collect" ? <Store className="w-4 h-4" /> : <Truck className="w-4 h-4" />}
            {order.fulfillment_type === "collect" ? "Click & Collect" : "Home Delivery"}
          </h2>
          {order.delivery_address && (
            <p className="text-sm text-[var(--color-text-secondary)]">
              {order.delivery_address.line1}{order.delivery_address.district ? `, ${order.delivery_address.district}` : ""}{order.delivery_address.province ? `, ${order.delivery_address.province}` : ""}
            </p>
          )}
          {order.prescription_url && (
            <a href={order.prescription_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-[var(--color-primary-600)] hover:underline mt-2">
              <FileText className="w-4 h-4" />
              View Prescription
            </a>
          )}
        </div>

        {/* Items */}
        <div className="card p-4">
          <h2 className="font-bold text-sm mb-3">Order Items</h2>
          <div className="flex flex-col gap-3">
            {order.items?.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <div>
                  <p className="font-medium">{item.product?.name}</p>
                  <p className="text-xs text-[var(--color-text-secondary)]">Qty: {item.quantity} × {formatPrice(item.unit_price)}</p>
                </div>
                <p className="font-bold">{formatPrice(item.total_price)}</p>
              </div>
            ))}
          </div>
          <div className="border-t border-[var(--color-border)] mt-4 pt-4 flex flex-col gap-1.5 text-sm">
            <div className="flex justify-between"><span className="text-[var(--color-text-secondary)]">Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-[var(--color-text-secondary)]">Delivery</span><span>{formatPrice(order.delivery_fee)}</span></div>
            {order.discount > 0 && <div className="flex justify-between text-success"><span>Discount</span><span>-{formatPrice(order.discount)}</span></div>}
            <div className="flex justify-between font-bold text-base"><span>Total</span><span className="text-[var(--color-primary-700)]">{formatPrice(order.total)}</span></div>
          </div>
        </div>

        {/* Payment */}
        {order.payment && (
          <div className="card p-4">
            <h2 className="font-bold text-sm mb-3">Payment</h2>
            <div className="flex flex-col gap-1.5 text-sm">
              <div className="flex justify-between"><span className="text-[var(--color-text-secondary)]">Method</span><span className="capitalize">{order.payment.method}</span></div>
              <div className="flex justify-between"><span className="text-[var(--color-text-secondary)]">Status</span>
                <span className={`font-semibold capitalize ${order.payment.status === "paid" ? "text-success" : order.payment.status === "failed" ? "text-error" : "text-amber-600"}`}>
                  {order.payment.status}
                </span>
              </div>
              {order.payment.transaction_id && (
                <div className="flex justify-between"><span className="text-[var(--color-text-secondary)]">Transaction ID</span><span className="font-mono text-xs">{order.payment.transaction_id}</span></div>
              )}
            </div>
          </div>
        )}

        {/* Status updater */}
        <div className="card p-4">
          <h2 className="font-bold text-sm mb-3">Update Status</h2>
          <OrderStatusUpdater orderId={order.id} currentStatus={order.status} />
        </div>
      </div>
    </div>
  );
}
