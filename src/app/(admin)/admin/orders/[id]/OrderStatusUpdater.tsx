"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import type { OrderStatus } from "@/types";
import { Button } from "@/components/ui/button";

const statusFlow: OrderStatus[] = [
  "pending", "confirmed", "processing", "ready", "dispatched", "delivered",
];

interface Props {
  orderId: string;
  currentStatus: OrderStatus;
}

export function OrderStatusUpdater({ orderId, currentStatus }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<OrderStatus>(currentStatus);

  async function handleUpdate() {
    if (selected === currentStatus) return;
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("orders")
        .update({ status: selected, updated_at: new Date().toISOString() } as any)
        .eq("id", orderId);
      if (error) throw error;
      toast.success(`Order status updated to ${selected}`);
      router.refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {statusFlow.map((status) => (
          <button
            key={status}
            onClick={() => setSelected(status)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              selected === status
                ? "bg-[var(--color-primary-600)] text-white border-[var(--color-primary-600)]"
                : "border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary-400)] hover:text-[var(--color-text)]"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
        <button
          onClick={() => setSelected("cancelled")}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
            selected === "cancelled"
              ? "bg-error text-white border-error"
              : "border-[var(--color-border)] text-error hover:border-error"
          }`}
        >
          Cancelled
        </button>
      </div>

      {selected !== currentStatus && (
        <Button
          onClick={handleUpdate}
          loading={loading}
          variant="primary"
          size="sm"
          className="w-fit"
        >
          Update to &quot;{selected}&quot;
        </Button>
      )}
    </div>
  );
}
