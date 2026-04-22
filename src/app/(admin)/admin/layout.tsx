import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createServerClient, createAdminClient } from "@/lib/supabase/server";
import { LayoutDashboard, Package, ShoppingBag, Users, BarChart3, Settings, BookOpen, Star, Tag } from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Blog", href: "/admin/blog", icon: BookOpen },
  { label: "Reviews", href: "/admin/reviews", icon: Star },
  { label: "Promo Codes", href: "/admin/promos", icon: Tag },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login?next=/admin");

  const adminClient = createAdminClient();
  const { data: profile } = await adminClient
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if ((profile as { role: string } | null)?.role !== "admin") redirect("/");

  return (
    <div className="flex h-screen bg-[var(--color-surface-secondary)]">
      {/* Sidebar */}
      <aside className="w-56 flex flex-col shrink-0 hidden lg:flex" style={{ background: "var(--color-primary-950)" }}>
        <div className="px-4 py-5 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 relative shrink-0">
              <Image src="/logo.png" alt="Samui Home Clinic Pharmacy" fill className="object-contain" />
            </div>
            <div>
              <p className="text-white text-xs font-semibold tracking-wide" style={{ fontFamily: "var(--font-display)" }}>
                SAMUI HOME CLINIC
              </p>
              <p className="text-[10px] uppercase tracking-wider" style={{ color: "var(--color-accent-300)" }}>Admin</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="flex flex-col gap-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-white/10 hover:text-white transition-colors group"
                  >
                    <Icon className="w-4 h-4 shrink-0 group-hover:text-[var(--color-accent-300)]" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="px-4 py-4 border-t border-white/10">
          <p className="text-xs text-gray-500">{user.email}</p>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 overflow-auto flex flex-col">
        {/* Top bar (mobile) */}
        <header className="lg:hidden bg-white border-b border-[var(--color-border)] px-4 py-3 flex items-center gap-3">
          <span className="font-bold text-[var(--color-primary-700)]">Samui Clinic Pharmacy Admin</span>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
