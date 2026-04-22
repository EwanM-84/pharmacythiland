import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse bg-[var(--color-surface-tertiary)] rounded-lg", className)} />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <Skeleton className="h-56 w-full rounded-none" />
      <div className="p-4 flex flex-col gap-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-10 w-full rounded-full" />
      </div>
    </div>
  );
}

export function OrderRowSkeleton() {
  return (
    <div className="card p-4 flex items-center gap-4">
      <Skeleton className="h-12 w-12 rounded-xl shrink-0" />
      <div className="flex-1 flex flex-col gap-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-3 w-28" />
      </div>
      <Skeleton className="h-6 w-20 rounded-full" />
    </div>
  );
}
