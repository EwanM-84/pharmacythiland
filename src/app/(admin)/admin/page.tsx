import { createAdminClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils";
import { OrderStatusBadge } from "@/components/ui/badge";
import type { Order } from "@/types";
import { TrendingUp, ShoppingBag, Users, AlertTriangle } from "lucide-react";
import Link from "next/link";

async function getDashboardData() {
  const supabase = createAdminClient();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    todayOrdersRes,
    totalCustomersRes,
    lowStockRes,
    recentOrdersRes,
    pendingOrdersRes,
  ] = await Promise.all([
    supabase
      .from("orders")
      .select("total")
      .gte("created_at", today.toISOString())
      .neq("status", "cancelled"),
    supabase.from("profiles").select("id", { count: "exact" }).eq("role", "customer"),
    supabase.from("products").select("id,name,stock_qty,low_stock_threshold").eq("is_active", true).lte("stock_qty", 10),
    supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(5),
    supabase.from("orders").select("id", { count: "exact" }).eq("status", "pending"),
  ]);

  const todayRevenue = (todayOrdersRes.data ?? []).reduce(
    (sum: number, o: { total: number }) => sum + o.total, 0
  );

  return {
    todayRevenue,
    todayOrders: todayOrdersRes.data?.length ?? 0,
    totalCustomers: totalCustomersRes.count ?? 0,
    lowStockCount: lowStockRes.data?.length ?? 0,
    lowStockItems: (lowStockRes.data ?? []) as { id: string; name: string; stock_qty: number }[],
    recentOrders: (recentOrdersRes.data ?? []) as Order[],
    pendingOrders: pendingOrdersRes.count ?? 0,
  };
}

export default async function AdminDashboard() {
  const data = await getDashboardData();

  const stats = [
    { label: "Today's Revenue", value: formatPrice(data.todayRevenue), sub: `${data.todayOrders} orders`, icon: <TrendingUp className="w-5 h-5" />, color: "primary" },
    { label: "Pending Orders", value: data.pendingOrders, sub: "Need confirmation", icon: <ShoppingBag className="w-5 h-5" />, color: "warning", href: "/admin/orders?status=pending" },
    { label: "Total Customers", value: data.totalCustomers, sub: "Registered accounts", icon: <Users className="w-5 h-5" />, color: "info", href: "/admin/customers" },
    { label: "Low Stock Alerts", value: data.lowStockCount, sub: "Products running low", icon: <AlertTriangle className="w-5 h-5" />, color: "error", href: "/admin/products?low_stock=true" },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Dashboard</h1>
        <p className="text-sm text-[var(--color-text-secondary)]">Welcome back — here&apos;s what&apos;s happening today.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className={`card p-4 ${stat.href ? "cursor-pointer hover:shadow-md transition-shadow" : ""}`}>
            {stat.href ? (
              <Link href={stat.href} className="block">
                <StatCard stat={stat} />
              </Link>
            ) : (
              <StatCard stat={stat} />
            )}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold">Recent Orders</h2>
            <Link href="/admin/orders" className="text-sm text-[var(--color-primary-600)] font-semibold">View all →</Link>
          </div>
          <div className="flex flex-col gap-3">
            {data.recentOrders.map((order) => (
              <Link key={order.id} href={`/admin/orders/${order.id}`} className="card-hover p-4 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{order.order_number}</p>
                  <p className="text-xs text-[var(--color-text-secondary)]">{order.fulfillment_type}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm text-[var(--color-primary-700)]">{formatPrice(order.total)}</p>
                  <OrderStatusBadge status={order.status} />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Low Stock Alerts */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold">Low Stock Alerts</h2>
            <Link href="/admin/products" className="text-sm text-[var(--color-primary-600)] font-semibold">Manage →</Link>
          </div>
          <div className="flex flex-col gap-3">
            {data.lowStockItems.length === 0 ? (
              <div className="card p-6 text-center text-[var(--color-text-secondary)] text-sm">
                All products are well-stocked
              </div>
            ) : (
              data.lowStockItems.map((item) => (
                <Link key={item.id} href={`/admin/products/${item.id}/edit`} className="card-hover p-4 flex items-center justify-between">
                  <span className="text-sm font-medium truncate">{item.name}</span>
                  <span className={`badge text-xs ${item.stock_qty === 0 ? "badge-error" : "badge-warning"}`}>
                    {item.stock_qty === 0 ? "Out of stock" : `${item.stock_qty} left`}
                  </span>
                </Link>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function StatCard({ stat }: { stat: { label: string; value: string | number; sub: string; icon: React.ReactNode; color: string } }) {
  const colorMap: Record<string, string> = {
    primary: "bg-[var(--color-primary-50)] text-[var(--color-primary-600)]",
    warning: "bg-[var(--color-warning-bg)] text-amber-600",
    info: "bg-[var(--color-info-bg)] text-blue-600",
    error: "bg-[var(--color-error-bg)] text-red-600",
  };
  return (
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs text-[var(--color-text-secondary)] mb-1">{stat.label}</p>
        <p className="text-2xl font-extrabold text-[var(--color-text)]">{stat.value}</p>
        <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">{stat.sub}</p>
      </div>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorMap[stat.color] ?? colorMap.primary}`}>
        {stat.icon}
      </div>
    </div>
  );
}
