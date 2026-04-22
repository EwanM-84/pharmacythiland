-- ============================================================
-- Samui Home Pharmacy — Supabase Schema
-- Run this in the Supabase SQL editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ---- Categories ----
CREATE TABLE IF NOT EXISTS categories (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url   TEXT,
  parent_id   UUID REFERENCES categories(id) ON DELETE SET NULL,
  sort_order  INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ---- Products ----
CREATE TABLE IF NOT EXISTS products (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name                  TEXT NOT NULL,
  slug                  TEXT NOT NULL UNIQUE,
  description           TEXT,
  short_description     TEXT,
  sku                   TEXT UNIQUE,
  barcode               TEXT,
  price                 DECIMAL(10,2) NOT NULL,
  cost_price            DECIMAL(10,2),
  compare_price         DECIMAL(10,2),
  stock_qty             INT NOT NULL DEFAULT 0,
  low_stock_threshold   INT NOT NULL DEFAULT 10,
  category_id           UUID REFERENCES categories(id) ON DELETE SET NULL,
  images                TEXT[] DEFAULT '{}',
  tags                  TEXT[] DEFAULT '{}',
  requires_prescription BOOLEAN DEFAULT false,
  is_active             BOOLEAN DEFAULT true,
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_active ON products(is_active);

-- ---- Profiles (extends auth.users) ----
CREATE TABLE IF NOT EXISTS profiles (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name       TEXT,
  phone           TEXT,
  role            TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  loyalty_balance INT NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, phone, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'phone',
    'customer'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_new_user();

-- ---- Addresses ----
CREATE TABLE IF NOT EXISTS addresses (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id  UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  label       TEXT,
  line1       TEXT NOT NULL,
  line2       TEXT,
  district    TEXT,
  province    TEXT DEFAULT 'Surat Thani',
  postal_code TEXT,
  is_default  BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_addresses_profile ON addresses(profile_id);

-- ---- Orders ----
CREATE TABLE IF NOT EXISTS orders (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number     TEXT NOT NULL UNIQUE,
  profile_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  status           TEXT NOT NULL DEFAULT 'pending'
                     CHECK (status IN ('pending','confirmed','processing','ready','dispatched','delivered','cancelled')),
  fulfillment_type TEXT NOT NULL CHECK (fulfillment_type IN ('delivery','collect')),
  subtotal         DECIMAL(10,2) NOT NULL,
  delivery_fee     DECIMAL(10,2) NOT NULL DEFAULT 0,
  discount         DECIMAL(10,2) NOT NULL DEFAULT 0,
  total            DECIMAL(10,2) NOT NULL,
  delivery_address JSONB,
  prescription_url TEXT,
  promo_code       TEXT,
  notes            TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_orders_profile ON orders(profile_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);

-- ---- Order Items ----
CREATE TABLE IF NOT EXISTS order_items (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id    UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id  UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  quantity    INT NOT NULL,
  unit_price  DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL
);
CREATE INDEX idx_order_items_order ON order_items(order_id);

-- ---- Payments ----
CREATE TABLE IF NOT EXISTS payments (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id       UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  provider       TEXT NOT NULL DEFAULT 'payso',
  transaction_id TEXT,
  method         TEXT CHECK (method IN ('card','promptpay')),
  status         TEXT NOT NULL DEFAULT 'pending'
                   CHECK (status IN ('pending','paid','failed','refunded')),
  amount         DECIMAL(10,2) NOT NULL,
  currency       TEXT NOT NULL DEFAULT 'THB',
  raw_response   JSONB,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ---- Cart Events (analytics) ----
CREATE TABLE IF NOT EXISTS cart_events (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  session_id TEXT,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  action     TEXT NOT NULL CHECK (action IN ('add','remove','checkout')),
  quantity   INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_cart_events_product ON cart_events(product_id);
CREATE INDEX idx_cart_events_created ON cart_events(created_at DESC);

-- ---- Reviews ----
CREATE TABLE IF NOT EXISTS reviews (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id  UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  profile_id  UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  order_id    UUID REFERENCES orders(id) ON DELETE SET NULL,
  rating      INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  body        TEXT,
  is_approved BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (product_id, profile_id, order_id)
);

-- ---- Loyalty Points ----
CREATE TABLE IF NOT EXISTS loyalty_points (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  order_id   UUID REFERENCES orders(id) ON DELETE SET NULL,
  action     TEXT NOT NULL,
  points     INT NOT NULL,
  balance    INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_loyalty_profile ON loyalty_points(profile_id);

-- ---- Blog Posts ----
CREATE TABLE IF NOT EXISTS blog_posts (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title        TEXT NOT NULL,
  slug         TEXT NOT NULL UNIQUE,
  excerpt      TEXT,
  body         TEXT NOT NULL DEFAULT '',
  cover_image  TEXT,
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ---- Delivery Settings ----
CREATE TABLE IF NOT EXISTS delivery_settings (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fee              DECIMAL(10,2) NOT NULL DEFAULT 80,
  free_over        DECIMAL(10,2) DEFAULT 500,
  estimated_hours  INT DEFAULT 3,
  collect_address  TEXT
);
-- Seed default settings
INSERT INTO delivery_settings (fee, free_over, estimated_hours, collect_address)
VALUES (80, 500, 3, 'Samui Home Pharmacy, Koh Samui, Surat Thani')
ON CONFLICT DO NOTHING;

-- ---- Promo Codes ----
CREATE TABLE IF NOT EXISTS promo_codes (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code           TEXT NOT NULL UNIQUE,
  discount_type  TEXT NOT NULL CHECK (discount_type IN ('fixed','percentage')),
  discount_value DECIMAL(10,2) NOT NULL,
  min_order      DECIMAL(10,2),
  uses_remaining INT,
  expires_at     TIMESTAMPTZ,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_events ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/update own profile
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Addresses: users manage their own
CREATE POLICY "Users manage own addresses" ON addresses USING (auth.uid() = profile_id);

-- Orders: users see their own
CREATE POLICY "Users view own orders" ON orders FOR SELECT USING (auth.uid() = profile_id);

-- Order items: users see their own orders' items
CREATE POLICY "Users view own order items" ON order_items FOR SELECT
  USING (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.profile_id = auth.uid()));

-- Reviews: approved reviews are public, users manage their own
CREATE POLICY "Anyone reads approved reviews" ON reviews FOR SELECT USING (is_approved = true);
CREATE POLICY "Users create reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() = profile_id);

-- Loyalty: users see their own
CREATE POLICY "Users view own loyalty" ON loyalty_points FOR SELECT USING (auth.uid() = profile_id);

-- Products & categories: public read
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read products" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);

-- Blog: public read published
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads published posts" ON blog_posts FOR SELECT USING (is_published = true);

-- ============================================================
-- Seed categories
-- ============================================================
INSERT INTO categories (name, slug, sort_order) VALUES
  ('Pain Relief', 'pain-relief', 1),
  ('Vitamins & Supplements', 'vitamins', 2),
  ('Baby & Child', 'baby', 3),
  ('Skincare', 'skincare', 4),
  ('First Aid', 'first-aid', 5),
  ('Cold & Flu', 'cold-flu', 6),
  ('Digestion', 'digestion', 7),
  ('Allergy', 'allergy', 8)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- Supabase Storage Buckets
-- Create these in Supabase Dashboard > Storage:
--   1. product-images  (public)
--   2. blog-images     (public)
--   3. prescriptions   (private)
-- ============================================================
