import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/server";
import { formatPrice, formatDate } from "@/lib/utils";
import { OrderStatusBadge } from "@/components/ui/badge";
import type { Order } from "@/types";

interface PageProps {
  searchParams: Promise<{ status?: string; q?: string }>;
}

const statusFilters = [
  { label: "All", value: "" },
  { label: "Pending", value: "pending" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Processing", value: "processing" },
  { label: "Dispatched", value: "dispatched" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
];

export default async function AdminOrdersPage({ searchParams }: PageProps) {
  const { status, q } = await searchParams;
  const supabase = createAdminClient();

  let query = supabase
    .from("orders")
    .select("*, profile:profiles(full_name,phone)")
    .order("created_at", { ascending: false })
    .limit(100);

  if (status) query = query.eq("status", status);
  if (q) query = query.ilike("order_number", `%${q}%`);

  const { data: orders } = await query;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Orders</h1>

      {/* Status filter tabs */}
      <div className="flex gap-1 flex-wrap mb-4 bg-[var(--color-surface-secondary)] p-1 rounded-xl w-fit">
        {statusFilters.map((f) => (
          <Link
            key={f.value}
            href={`/admin/orders${f.value ? `?status=${f.value}` : ""}`}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              (status ?? "") === f.value
                ? "bg-white text-[var(--color-primary-700)] shadow-sm"
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
            }`}
          >
            {f.label}
          </Link>
        ))}
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[var(--color-surface-secondary)] border-b border-[var(--color-border)]">
              <tr>
                {["Order #", "Customer", "Type", "Total", "Status", "Date", ""].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {(orders as (Order & { profile?: { full_name: string | null; phone: string | null } })[])?.map((order) => (
                <tr key={order.id} className="hover:bg-[var(--color-surface-secondary)] transition-colors">
                  <td className="px-4 py-3 font-mono font-semibold text-[var(--color-primary-700)] text-xs">{order.order_number}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium">{order.profile?.full_name ?? "—"}</p>
                    {order.profile?.phone && <p className="text-xs text-[var(--color-text-secondary)]">{order.profile.phone}</p>}
                  </td>
                  <td className="px-4 py-3">
                    <span className="capitalize text-[var(--color-text-secondary)]">{order.fulfillment_type}</span>
                  </td>
                  <td className="px-4 py-3 font-bold text-[var(--color-primary-700)]">{formatPrice(order.total)}</td>
                  <td className="px-4 py-3"><OrderStatusBadge status={order.status} /></td>
                  <td className="px-4 py-3 text-[var(--color-text-secondary)] whitespace-nowrap">{formatDate(order.created_at)}</td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/orders/${order.id}`} className="text-xs text-[var(--color-primary-600)] font-semibold hover:underline">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(!orders || orders.length === 0) && (
            <div className="p-10 text-center text-[var(--color-text-secondary)]">No orders found</div>
          )}
        </div>
      </div>
    </div>
  );
}
