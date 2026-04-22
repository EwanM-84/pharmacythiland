import { cn } from "@/lib/utils";

type BadgeVariant = "primary" | "success" | "warning" | "error" | "gray" | "info";

interface BadgeProps {
  variant?: BadgeVariant;
  className?: string;
  children: React.ReactNode;
}

const variantClasses: Record<BadgeVariant, string> = {
  primary: "badge badge-primary",
  success: "badge badge-success",
  warning: "badge badge-warning",
  error: "badge badge-error",
  gray: "badge badge-gray",
  info: "badge bg-[var(--color-info-bg)] text-blue-700",
};

export function Badge({ variant = "gray", className, children }: BadgeProps) {
  return <span className={cn(variantClasses[variant], className)}>{children}</span>;
}

// Order status badge
import { orderStatusMeta } from "@/lib/utils";

export function OrderStatusBadge({ status }: { status: string }) {
  const { label, colour } = orderStatusMeta(status);
  const variantMap: Record<string, BadgeVariant> = {
    primary: "primary",
    success: "success",
    warning: "warning",
    error: "error",
    gray: "gray",
    info: "info",
  };
  return <Badge variant={variantMap[colour] ?? "gray"}>{label}</Badge>;
}

// Star rating display
export function StarRating({ rating, count }: { rating: number; count?: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={cn("w-4 h-4", star <= Math.round(rating) ? "text-yellow-400" : "text-[var(--color-border-strong)]")}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      {count !== undefined && (
        <span className="text-sm text-[var(--color-text-secondary)] ml-1">({count})</span>
      )}
    </div>
  );
}
