import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/server";
import { formatPrice, computeMargin } from "@/lib/utils";
import type { Product } from "@/types";
import { Plus, Upload, Search } from "lucide-react";

interface PageProps {
  searchParams: Promise<{ q?: string; low_stock?: string }>;
}

export default async function AdminProductsPage({ searchParams }: PageProps) {
  const { q, low_stock } = await searchParams;
  const supabase = createAdminClient();

  let query = supabase
    .from("products")
    .select("*, category:categories(name)")
    .order("created_at", { ascending: false });

  if (q) query = query.ilike("name", `%${q}%`);
  if (low_stock === "true") query = query.lte("stock_qty", 10);

  const { data: products } = await query.limit(100);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <div className="flex gap-2">
          <Link href="/admin/products/import" className="btn-secondary text-sm py-2 px-4">
            <Upload className="w-4 h-4" />
            Import CSV
          </Link>
          <Link href="/admin/products/new" className="btn-primary text-sm py-2 px-4">
            <Plus className="w-4 h-4" />
            Add Product
          </Link>
        </div>
      </div>

      {/* Search */}
      <form className="mb-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Search products…"
            className="input-base pl-10 py-2.5 text-sm"
          />
        </div>
      </form>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[var(--color-surface-secondary)] border-b border-[var(--color-border)]">
              <tr>
                {["Product", "Category", "Price", "Cost", "Margin", "Stock", "Status", ""].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {(products as Product[])?.map((product) => {
                const margin = computeMargin(product.price, product.cost_price);
                return (
                  <tr key={product.id} className="hover:bg-[var(--color-surface-secondary)] transition-colors">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-semibold">{product.name}</p>
                        {product.sku && <p className="text-xs text-[var(--color-text-muted)]">SKU: {product.sku}</p>}
                        {product.requires_prescription && (
                          <span className="badge badge-warning text-[10px]">Rx</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[var(--color-text-secondary)]">
                      {(product.category as { name?: string } | null)?.name ?? "—"}
                    </td>
                    <td className="px-4 py-3 font-semibold text-[var(--color-primary-700)]">
                      {formatPrice(product.price)}
                    </td>
                    <td className="px-4 py-3 text-[var(--color-text-secondary)]">
                      {product.cost_price ? formatPrice(product.cost_price) : "—"}
                    </td>
                    <td className="px-4 py-3">
                      {margin !== null ? (
                        <span className={`badge text-xs ${margin >= 30 ? "badge-success" : margin >= 15 ? "badge-warning" : "badge-error"}`}>
                          {margin}%
                        </span>
                      ) : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span className={product.stock_qty <= 0 ? "text-error font-semibold" : product.stock_qty <= product.low_stock_threshold ? "text-amber-600 font-semibold" : "text-success font-semibold"}>
                        {product.stock_qty}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge text-xs ${product.is_active ? "badge-success" : "badge-gray"}`}>
                        {product.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="text-xs text-[var(--color-primary-600)] font-semibold hover:underline"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {(!products || products.length === 0) && (
            <div className="p-10 text-center text-[var(--color-text-secondary)]">No products found</div>
          )}
        </div>
      </div>
    </div>
  );
}
