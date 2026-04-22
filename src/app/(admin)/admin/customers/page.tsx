import { createAdminClient } from "@/lib/supabase/server";
import { formatDate, formatPrice } from "@/lib/utils";
import { Search, Users } from "lucide-react";
import type { Profile } from "@/types";

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function AdminCustomersPage({ searchParams }: PageProps) {
  const { q } = await searchParams;
  const supabase = createAdminClient();

  let query = supabase
    .from("profiles")
    .select("*")
    .eq("role", "customer")
    .order("created_at", { ascending: false });

  if (q) query = query.ilike("full_name", `%${q}%`);

  const { data: customers } = await query.limit(100);

  // Get order totals per customer
  const profileIds = (customers ?? []).map((c: Profile) => c.id);
  const { data: orderStats } = profileIds.length
    ? await supabase
        .from("orders")
        .select("profile_id, total")
        .in("profile_id", profileIds)
        .neq("status", "cancelled")
    : { data: [] };

  const statsByProfile: Record<string, { count: number; total: number }> = {};
  for (const o of orderStats ?? []) {
    const rec = o as { profile_id: string; total: number };
    if (!statsByProfile[rec.profile_id]) statsByProfile[rec.profile_id] = { count: 0, total: 0 };
    statsByProfile[rec.profile_id].count++;
    statsByProfile[rec.profile_id].total += rec.total;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--color-primary-50)] text-[var(--color-primary-600)] flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-bold">Customers</h1>
        </div>
        <p className="text-sm text-[var(--color-text-secondary)]">{customers?.length ?? 0} total</p>
      </div>

      <form className="mb-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Search by name…"
            className="input-base pl-10 py-2.5 text-sm"
          />
        </div>
      </form>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[var(--color-surface-secondary)] border-b border-[var(--color-border)]">
              <tr>
                {["Customer", "Phone", "Loyalty Points", "Orders", "Total Spent", "Joined"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {(customers as Profile[])?.map((customer) => {
                const stats = statsByProfile[customer.id] ?? { count: 0, total: 0 };
                return (
                  <tr key={customer.id} className="hover:bg-[var(--color-surface-secondary)] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[var(--color-primary-100)] flex items-center justify-center text-[var(--color-primary-700)] font-bold text-xs">
                          {(customer.full_name ?? "?")[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold">{customer.full_name ?? "—"}</p>
                          <p className="text-xs text-[var(--color-text-muted)]">{customer.id.slice(0, 8)}…</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[var(--color-text-secondary)]">{customer.phone ?? "—"}</td>
                    <td className="px-4 py-3">
                      <span className="badge badge-primary text-xs">{customer.loyalty_balance ?? 0} pts</span>
                    </td>
                    <td className="px-4 py-3 font-semibold">{stats.count}</td>
                    <td className="px-4 py-3 font-semibold text-[var(--color-primary-700)]">
                      {stats.total > 0 ? formatPrice(stats.total) : "—"}
                    </td>
                    <td className="px-4 py-3 text-[var(--color-text-secondary)]">{formatDate(customer.created_at)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {(!customers || customers.length === 0) && (
            <div className="p-10 text-center text-[var(--color-text-secondary)]">No customers found</div>
          )}
        </div>
      </div>
    </div>
  );
}
