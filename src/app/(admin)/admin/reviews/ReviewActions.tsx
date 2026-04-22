"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Check, X } from "lucide-react";

export function ReviewActions({ reviewId, isApproved }: { reviewId: string; isApproved: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function update(approve: boolean) {
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await (supabase as any).from("reviews").update({ is_approved: approve }).eq("id", reviewId);
      if (error) throw error;
      toast.success(approve ? "Review approved" : "Review rejected");
      router.refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  async function deleteReview() {
    if (!confirm("Delete this review permanently?")) return;
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("reviews").delete().eq("id", reviewId);
      if (error) throw error;
      toast.success("Review deleted");
      router.refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex gap-1.5 shrink-0">
      {!isApproved && (
        <button
          onClick={() => update(true)}
          disabled={loading}
          className="p-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
          title="Approve"
        >
          <Check className="w-4 h-4" />
        </button>
      )}
      {isApproved && (
        <button
          onClick={() => update(false)}
          disabled={loading}
          className="p-1.5 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors"
          title="Unapprove"
        >
          <X className="w-4 h-4" />
        </button>
      )}
      <button
        onClick={deleteReview}
        disabled={loading}
        className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
        title="Delete"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
