import { createAdminClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils";
import { RevenueChart } from "./RevenueChart";

export const dynamic = "force-dynamic";

async function getAnalyticsData() {
  const supabase = createAdminClient();

  // Revenue for past 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [ordersRes, cartEventsRes, productsRes] = await Promise.all([
    supabase
      .from("orders")
      .select("total,created_at,status,items:order_items(quantity,unit_price,product:products(cost_price))")
      .neq("status", "cancelled")
      .gte("created_at", thirtyDaysAgo.toISOString())
      .order("created_at"),
    supabase
      .from("cart_events")
      .select("product_id,action,created_at,product:products(name)")
      .gte("created_at", thirtyDaysAgo.toISOString()),
    supabase
      .from("products")
      .select("id,name,price,cost_price")
      .eq("is_active", true)
      .limit(20),
  ]);

  type OrderRow = { total: number; created_at: string; items: { quantity: number; unit_price: number; product: { cost_price: number | null } | null }[] };
  const orders = (ordersRes.data ?? []) as unknown as OrderRow[];

  // Daily revenue
  const dailyMap = new Map<string, { revenue: number; orders: number; cogs: number }>();
  for (const order of orders) {
    const date = order.created_at.slice(0, 10);
    const existing = dailyMap.get(date) ?? { revenue: 0, orders: 0, cogs: 0 };
    const orderCogs = order.items?.reduce(
      (s: number, i: { quantity: number; unit_price: number; product: { cost_price: number | null } | null }) =>
        s + i.quantity * (i.product?.cost_price ?? i.unit_price * 0.6),
      0
    ) ?? 0;
    dailyMap.set(date, {
      revenue: existing.revenue + order.total,
      orders: existing.orders + 1,
      cogs: existing.cogs + orderCogs,
    });
  }
  const dailyStats = Array.from(dailyMap.entries())
    .map(([date, stats]) => ({ date, ...stats }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // Totals
  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  const totalCogs = orders.reduce((s, o) => {
    return s + (o.items?.reduce(
      (is: number, i: { quantity: number; unit_price: number; product: { cost_price: number | null } | null }) =>
        is + i.quantity * (i.product?.cost_price ?? i.unit_price * 0.6),
      0
    ) ?? 0);
  }, 0);
  const grossMargin = totalRevenue > 0 ? ((totalRevenue - totalCogs) / totalRevenue) * 100 : 0;

  // Cart abandonment
  type CartEventRow = { product_id: string; action: string; product: { name: string } | null };
  const events = (cartEventsRes.data ?? []) as unknown as CartEventRow[];
  const addToCartCount = events.filter((e) => e.action === "add").length;
  const checkoutCount = events.filter((e) => e.action === "checkout").length;
  const abandonRate = addToCartCount > 0 ? Math.round(((addToCartCount - checkoutCount) / addToCartCount) * 100) : 0;

  // Top products by add-to-cart
  const productCartCounts = new Map<string, { name: string; addCount: number; checkoutCount: number }>();
  for (const ev of events) {
    const key = ev.product_id;
    const existing = productCartCounts.get(key) ?? { name: ev.product?.name ?? key, addCount: 0, checkoutCount: 0 };
    if (ev.action === "add") existing.addCount++;
    if (ev.action === "checkout") existing.checkoutCount++;
    productCartCounts.set(key, existing);
  }
  const topProducts = Array.from(productCartCounts.values())
    .sort((a, b) => b.addCount - a.addCount)
    .slice(0, 10);

  return {
    dailyStats,
    totalRevenue,
    totalCogs,
    grossMargin,
    totalOrders: orders.length,
    addToCartCount,
    checkoutCount,
    abandonRate,
    topProducts,
  };
}

export default async function AnalyticsPage() {
  const data = await getAnalyticsData();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Analytics</h1>

      {/* KPI row */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Revenue (30d)", value: formatPrice(data.totalRevenue), sub: `${data.totalOrders} orders` },
          { label: "COGS (30d)", value: formatPrice(data.totalCogs), sub: "Cost of goods sold" },
          { label: "Gross Margin", value: `${data.grossMargin.toFixed(1)}%`, sub: "After COGS" },
          { label: "Cart Abandonment", value: `${data.abandonRate}%`, sub: `${data.addToCartCount} adds, ${data.checkoutCount} checkouts` },
        ].map((stat) => (
          <div key={stat.label} className="card p-4">
            <p className="text-xs text-[var(--color-text-secondary)] mb-1">{stat.label}</p>
            <p className="text-2xl font-extrabold text-[var(--color-text)]">{stat.value}</p>
            <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Revenue chart */}
      <div className="card p-5 mb-6">
        <h2 className="font-bold mb-4">Daily Revenue — Past 30 Days</h2>
        <RevenueChart data={data.dailyStats} />
      </div>

      {/* Top products */}
      <div className="card overflow-hidden">
        <div className="px-4 py-3 border-b border-[var(--color-border)]">
          <h2 className="font-bold">Top Products by Add-to-Cart</h2>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-[var(--color-surface-secondary)]">
            <tr>
              {["Product", "Add to Cart", "Checkout", "Conversion"].map((h) => (
                <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {data.topProducts.map((p, i) => {
              const conv = p.addCount > 0 ? Math.round((p.checkoutCount / p.addCount) * 100) : 0;
              return (
                <tr key={i} className="hover:bg-[var(--color-surface-secondary)]">
                  <td className="px-4 py-3 font-medium">{p.name}</td>
                  <td className="px-4 py-3">{p.addCount}</td>
                  <td className="px-4 py-3">{p.checkoutCount}</td>
                  <td className="px-4 py-3">
                    <span className={`badge text-xs ${conv >= 50 ? "badge-success" : conv >= 25 ? "badge-warning" : "badge-error"}`}>
                      {conv}%
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
