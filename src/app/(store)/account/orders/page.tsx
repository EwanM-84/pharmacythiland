import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerClient, createAdminClient } from "@/lib/supabase/server";
import { formatPrice, formatDate } from "@/lib/utils";
import { OrderStatusBadge } from "@/components/ui/badge";
import type { Order } from "@/types";
import { ShoppingBag, ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login?next=/account/orders");

  const adminClient = createAdminClient();
  const { data: orders } = await adminClient
    .from("orders")
    .select("*, items:order_items(id)")
    .eq("profile_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/account" className="p-2 rounded-lg hover:bg-[var(--color-surface-secondary)] transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold">My Orders</h1>
      </div>

      {(!orders || orders.length === 0) ? (
        <div className="card p-12 text-center">
          <ShoppingBag className="w-12 h-12 mx-auto mb-4 text-[var(--color-border-strong)]" />
          <p className="text-[var(--color-text-secondary)] mb-3">You haven&apos;t placed any orders yet.</p>
          <Link href="/shop" className="btn-primary inline-flex">Start shopping</Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {(orders as (Order & { items: { id: string }[] })[]).map((order) => (
            <Link
              key={order.id}
              href={`/account/orders/${order.id}`}
              className="card-hover p-4 sm:p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[var(--color-primary-50)] flex items-center justify-center shrink-0">
                    <ShoppingBag className="w-5 h-5 text-[var(--color-primary-600)]" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">{order.order_number}</p>
                    <p className="text-xs text-[var(--color-text-secondary)]">{formatDate(order.created_at)}</p>
                    <p className="text-xs text-[var(--color-text-muted)] capitalize">{order.fulfillment_type} · {(order.items ?? []).length} item{(order.items ?? []).length !== 1 ? "s" : ""}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-[var(--color-primary-700)]">{formatPrice(order.total)}</p>
                  <OrderStatusBadge status={order.status} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
