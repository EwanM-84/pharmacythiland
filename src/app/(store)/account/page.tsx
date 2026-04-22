import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerClient, createAdminClient } from "@/lib/supabase/server";
import { formatPrice, formatDate, orderStatusMeta } from "@/lib/utils";
import { OrderStatusBadge } from "@/components/ui/badge";
import type { Order, Profile, LoyaltyEvent } from "@/types";
import { ShoppingBag, MapPin, Coins, User, LogOut } from "lucide-react";
import { SignOutButton } from "./SignOutButton";

export const dynamic = "force-dynamic";

async function getAccountData(userId: string) {
  const supabase = createAdminClient();
  const [profileRes, ordersRes, loyaltyRes] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", userId).single(),
    supabase.from("orders").select("*").eq("profile_id", userId).order("created_at", { ascending: false }).limit(5),
    supabase.from("loyalty_points").select("*").eq("profile_id", userId).order("created_at", { ascending: false }).limit(5),
  ]);
  return {
    profile: profileRes.data as Profile | null,
    orders: (ordersRes.data as Order[]) ?? [],
    loyaltyEvents: (loyaltyRes.data as LoyaltyEvent[]) ?? [],
  };
}

export default async function AccountPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login?next=/account");

  const { profile, orders, loyaltyEvents } = await getAccountData(user.id);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="page-title">My Account</h1>
        <SignOutButton />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: <ShoppingBag className="w-5 h-5" />, label: "Total Orders", value: orders.length, href: "/account/orders" },
          { icon: <Coins className="w-5 h-5" />, label: "Loyalty Points", value: `${profile?.loyalty_balance ?? 0} pts`, href: "#loyalty" },
          { icon: <MapPin className="w-5 h-5" />, label: "Saved Addresses", value: "Manage", href: "/account/addresses" },
          { icon: <User className="w-5 h-5" />, label: "Profile", value: profile?.full_name ?? "Update", href: "/account/profile" },
        ].map((card) => (
          <Link key={card.label} href={card.href} className="card-hover p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-primary-50)] text-[var(--color-primary-600)] flex items-center justify-center shrink-0">
              {card.icon}
            </div>
            <div>
              <p className="text-xs text-[var(--color-text-secondary)]">{card.label}</p>
              <p className="font-bold text-sm text-[var(--color-text)]">{card.value}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent orders */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg">Recent Orders</h2>
          <Link href="/account/orders" className="text-sm font-semibold text-[var(--color-primary-600)]">View all →</Link>
        </div>
        {orders.length === 0 ? (
          <div className="card p-8 text-center text-[var(--color-text-secondary)]">
            <ShoppingBag className="w-10 h-10 mx-auto mb-3 text-[var(--color-border-strong)]" />
            <p>No orders yet.</p>
            <Link href="/shop" className="text-sm text-[var(--color-primary-600)] font-semibold mt-1 block">Start shopping →</Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {orders.map((order) => (
              <Link key={order.id} href={`/account/orders/${order.id}`} className="card-hover p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[var(--color-primary-50)] flex items-center justify-center shrink-0">
                  <ShoppingBag className="w-5 h-5 text-[var(--color-primary-600)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-[var(--color-text)]">{order.order_number}</p>
                  <p className="text-xs text-[var(--color-text-secondary)]">{formatDate(order.created_at)}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-sm text-[var(--color-primary-700)]">{formatPrice(order.total)}</p>
                  <OrderStatusBadge status={order.status} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Loyalty history */}
      {loyaltyEvents.length > 0 && (
        <section id="loyalty">
          <h2 className="font-bold text-lg mb-4">Loyalty Points</h2>
          <div className="card p-4">
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-[var(--color-border)]">
              <Coins className="w-8 h-8 text-[var(--color-primary-600)]" />
              <div>
                <p className="text-2xl font-extrabold text-[var(--color-primary-700)]">{profile?.loyalty_balance ?? 0}</p>
                <p className="text-xs text-[var(--color-text-secondary)]">Available points ({formatPrice((profile?.loyalty_balance ?? 0) * 0.1)} value)</p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {loyaltyEvents.map((ev) => (
                <div key={ev.id} className="flex justify-between text-sm">
                  <span className="text-[var(--color-text-secondary)] capitalize">{ev.action}</span>
                  <span className={`font-semibold ${ev.points > 0 ? "text-success" : "text-error"}`}>
                    {ev.points > 0 ? "+" : ""}{ev.points} pts
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
