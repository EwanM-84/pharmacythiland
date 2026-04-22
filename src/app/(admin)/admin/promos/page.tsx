import { createAdminClient } from "@/lib/supabase/server";
import { formatDate, formatPrice } from "@/lib/utils";
import { Tag, Plus } from "lucide-react";
import type { PromoCode } from "@/types";
import { NewPromoForm } from "./NewPromoForm";
import { DeletePromoButton } from "./DeletePromoButton";

export default async function AdminPromosPage() {
  const supabase = createAdminClient();
  const { data: promos } = await supabase
    .from("promo_codes")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--color-primary-50)] text-[var(--color-primary-600)] flex items-center justify-center">
            <Tag className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-bold">Promo Codes</h1>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Create form */}
        <div className="lg:col-span-1">
          <div className="card p-5">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <Plus className="w-4 h-4" /> New Promo Code
            </h2>
            <NewPromoForm />
          </div>
        </div>

        {/* List */}
        <div className="lg:col-span-2">
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[var(--color-surface-secondary)] border-b border-[var(--color-border)]">
                <tr>
                  {["Code", "Discount", "Min Order", "Uses Left", "Expires", ""].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {(promos as PromoCode[])?.map((promo) => {
                  const isExpired = promo.expires_at ? new Date(promo.expires_at) < new Date() : false;
                  const isExhausted = promo.uses_remaining !== null && promo.uses_remaining <= 0;
                  return (
                    <tr key={promo.id} className={`hover:bg-[var(--color-surface-secondary)] transition-colors ${isExpired || isExhausted ? "opacity-50" : ""}`}>
                      <td className="px-4 py-3">
                        <code className="font-mono font-bold text-[var(--color-primary-700)] bg-[var(--color-primary-50)] px-2 py-0.5 rounded text-xs">
                          {promo.code}
                        </code>
                      </td>
                      <td className="px-4 py-3 font-semibold">
                        {promo.discount_type === "percentage"
                          ? `${promo.discount_value}% off`
                          : `฿${promo.discount_value} off`}
                      </td>
                      <td className="px-4 py-3 text-[var(--color-text-secondary)]">
                        {promo.min_order ? formatPrice(promo.min_order) : "—"}
                      </td>
                      <td className="px-4 py-3">
                        {promo.uses_remaining !== null ? (
                          <span className={`badge text-xs ${promo.uses_remaining <= 0 ? "badge-error" : "badge-success"}`}>
                            {promo.uses_remaining}
                          </span>
                        ) : (
                          <span className="badge badge-gray text-xs">Unlimited</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-[var(--color-text-secondary)]">
                        {promo.expires_at ? (
                          <span className={isExpired ? "text-red-500" : ""}>{formatDate(promo.expires_at)}</span>
                        ) : "Never"}
                      </td>
                      <td className="px-4 py-3">
                        <DeletePromoButton promoId={promo.id} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {(!promos || promos.length === 0) && (
              <div className="p-10 text-center text-[var(--color-text-secondary)]">No promo codes yet</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
