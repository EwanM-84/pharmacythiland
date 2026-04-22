import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format Thai Baht
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

// Format number with commas
export function formatNumber(n: number): string {
  return new Intl.NumberFormat("en-US").format(n);
}

// Format date
export function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(dateStr));
}

// Slugify
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

// Generate order number
export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `SHP-${timestamp}-${random}`;
}

// Compute product margin %
export function computeMargin(price: number, costPrice: number | null): number | null {
  if (!costPrice || costPrice <= 0) return null;
  return Math.round(((price - costPrice) / price) * 100);
}

// Truncate text
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + "…";
}

// Get order status label + colour
export function orderStatusMeta(status: string): { label: string; colour: string } {
  const map: Record<string, { label: string; colour: string }> = {
    pending: { label: "Pending Payment", colour: "warning" },
    confirmed: { label: "Confirmed", colour: "primary" },
    processing: { label: "Processing", colour: "info" },
    ready: { label: "Ready", colour: "success" },
    dispatched: { label: "Dispatched", colour: "primary" },
    delivered: { label: "Delivered", colour: "success" },
    cancelled: { label: "Cancelled", colour: "error" },
  };
  return map[status] ?? { label: status, colour: "gray" };
}
