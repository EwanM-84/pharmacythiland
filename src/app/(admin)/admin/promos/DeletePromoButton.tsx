"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Trash2 } from "lucide-react";

export function DeletePromoButton({ promoId }: { promoId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm("Delete this promo code?")) return;
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("promo_codes").delete().eq("id", promoId);
      if (error) throw error;
      toast.success("Deleted");
      router.refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="p-1.5 rounded text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
      title="Delete promo code"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
