// ============================================================
// Samui Home Clinic Pharmacy — Shared Types
// ============================================================

// ---- Auth / Profiles ----

export type UserRole = "customer" | "admin";

export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  role: UserRole;
  loyalty_balance: number;
  created_at: string;
}

// ---- Categories ----

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  parent_id: string | null;
  sort_order: number;
  created_at: string;
}

// ---- Products ----

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  sku: string | null;
  barcode: string | null;
  price: number;
  cost_price: number | null;
  compare_price: number | null;
  stock_qty: number;
  low_stock_threshold: number;
  category_id: string | null;
  category?: Category;
  images: string[];
  tags: string[];
  requires_prescription: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // computed
  margin?: number;
  avg_rating?: number;
  review_count?: number;
}

// ---- Addresses ----

export interface Address {
  id: string;
  profile_id: string;
  label: string | null;
  line1: string;
  line2: string | null;
  district: string | null;
  province: string | null;
  postal_code: string | null;
  is_default: boolean;
  created_at: string;
}

// ---- Cart (client-side) ----

export interface CartItem {
  product_id: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  quantity: number;
  requires_prescription: boolean;
}

// ---- Orders ----

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "ready"
  | "dispatched"
  | "delivered"
  | "cancelled";

export type FulfillmentType = "delivery" | "collect";

export interface Order {
  id: string;
  order_number: string;
  profile_id: string;
  profile?: Profile;
  status: OrderStatus;
  fulfillment_type: FulfillmentType;
  subtotal: number;
  delivery_fee: number;
  discount: number;
  total: number;
  delivery_address: Address | null;
  prescription_url: string | null;
  promo_code: string | null;
  notes: string | null;
  items?: OrderItem[];
  payment?: Payment;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product?: Product;
  quantity: number;
  unit_price: number;
  total_price: number;
}

// ---- Payments ----

export type PaymentMethod = "card" | "promptpay";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface Payment {
  id: string;
  order_id: string;
  provider: string;
  transaction_id: string | null;
  method: PaymentMethod;
  status: PaymentStatus;
  amount: number;
  currency: string;
  raw_response: unknown;
  created_at: string;
}

// ---- Reviews ----

export interface Review {
  id: string;
  product_id: string;
  profile_id: string;
  profile?: Pick<Profile, "full_name">;
  order_id: string;
  rating: number;
  body: string | null;
  is_approved: boolean;
  created_at: string;
}

// ---- Loyalty ----

export interface LoyaltyEvent {
  id: string;
  profile_id: string;
  order_id: string | null;
  action: string;
  points: number;
  balance: number;
  created_at: string;
}

// ---- Blog ----

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  body: string;
  cover_image: string | null;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
}

// ---- Delivery Settings ----

export interface DeliverySettings {
  id: string;
  fee: number;
  free_over: number | null;
  estimated_hours: number;
  collect_address: string | null;
}

// ---- Promo Codes ----

export interface PromoCode {
  id: string;
  code: string;
  discount_type: "fixed" | "percentage";
  discount_value: number;
  min_order: number | null;
  uses_remaining: number | null;
  expires_at: string | null;
}

// ---- Cart Events (analytics) ----

export interface CartEvent {
  id: string;
  profile_id: string | null;
  session_id: string | null;
  product_id: string;
  action: "add" | "remove" | "checkout";
  quantity: number;
  created_at: string;
}

// ---- Admin Analytics ----

export interface DailyStat {
  date: string;
  revenue: number;
  orders: number;
  cogs: number;
}

export interface ProductAnalytics {
  product_id: string;
  name: string;
  add_to_cart_count: number;
  purchase_count: number;
  revenue: number;
  margin: number;
}

// ---- API Responses ----

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

// ---- Checkout ----

export interface CheckoutPayload {
  items: CartItem[];
  fulfillment_type: FulfillmentType;
  address?: Address;
  promo_code?: string;
  loyalty_points_to_redeem?: number;
  payment_method: PaymentMethod;
}
