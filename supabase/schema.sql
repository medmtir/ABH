-- ============================================================
-- ABH Company — PostgreSQL Supabase Schema DDL with RLS
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Admin Users
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('superadmin', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Products
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  active BOOLEAN DEFAULT true,
  acidity_max NUMERIC(3,2) DEFAULT 0.8,
  hero_image TEXT NOT NULL,
  gallery_images JSONB DEFAULT '[]'::jsonb,
  specs JSONB NOT NULL DEFAULT '{}'::jsonb,
  certifications JSONB DEFAULT '[]'::jsonb,
  translations JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Certifications
CREATE TABLE IF NOT EXISTS certifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  logo TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  expiry_date DATE,
  pdf_url TEXT,
  translations JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Packagings
CREATE TABLE IF NOT EXISTS packagings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  capacity TEXT NOT NULL,
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  badge TEXT DEFAULT '',
  description TEXT DEFAULT '',
  sort_order INT DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  translations JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Contact Messages / RFQ
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  company_name TEXT NOT NULL,
  country TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  product_interest TEXT NOT NULL,
  quantity TEXT,
  destination_country TEXT,
  message TEXT NOT NULL,
  privacy_consent BOOLEAN DEFAULT true,
  file_attachment TEXT,
  status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'contacted', 'archived', 'trash')),
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  trashed_at TIMESTAMPTZ
);

-- 6. Clients
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  tax_id TEXT,
  contact_person TEXT,
  email TEXT,
  phone TEXT,
  country TEXT NOT NULL,
  address TEXT,
  notes TEXT,
  is_deleted BOOLEAN DEFAULT false,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Orders
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL,
  client_id TEXT,
  client_name TEXT NOT NULL,
  product_id TEXT,
  product_name TEXT NOT NULL,
  packaging TEXT NOT NULL,
  quantity NUMERIC(10,2) NOT NULL,
  unit TEXT NOT NULL DEFAULT 'tonnes',
  unit_price NUMERIC(12,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'EUR' CHECK (currency IN ('EUR', 'TND', 'USD')),
  total_amount NUMERIC(12,2) NOT NULL,
  paid_amount NUMERIC(12,2) DEFAULT 0,
  remaining_amount NUMERIC(12,2) NOT NULL,
  payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'partial', 'paid', 'overpaid')),
  order_status TEXT DEFAULT 'confirmed',
  order_date DATE DEFAULT CURRENT_DATE,
  payments JSONB DEFAULT '[]'::jsonb,
  delivery_installments JSONB DEFAULT '[]'::jsonb,
  delivered_quantity NUMERIC(10,2) DEFAULT 0,
  remaining_quantity NUMERIC(10,2) NOT NULL,
  delivery_status TEXT DEFAULT 'pending',
  is_deleted BOOLEAN DEFAULT false,
  deleted_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Site Settings
CREATE TABLE IF NOT EXISTS site_settings (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  company_name TEXT NOT NULL,
  tagline TEXT,
  country TEXT DEFAULT 'Tunisie',
  address TEXT,
  general_email TEXT,
  general_phone TEXT,
  whatsapp TEXT,
  developer_credit JSONB DEFAULT '{}'::jsonb,
  partners JSONB DEFAULT '[]'::jsonb,
  social_links JSONB DEFAULT '{}'::jsonb,
  seo JSONB DEFAULT '{}'::jsonb,
  google_site_verification TEXT,
  bing_site_verification TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Content Blocks
CREATE TABLE IF NOT EXISTS content_blocks (
  locale TEXT PRIMARY KEY,
  hero_title TEXT,
  hero_subtitle TEXT,
  hero_badge TEXT,
  hero_cta_primary TEXT,
  hero_cta_secondary TEXT,
  about_title TEXT,
  about_subtitle TEXT,
  about_text TEXT,
  why_choose_title TEXT,
  why_choose_subtitle TEXT,
  export_title TEXT,
  export_subtitle TEXT,
  export_text TEXT,
  about_who_we_are TEXT,
  about_mission TEXT,
  about_vision TEXT,
  about_mill_heritage TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (RLS)
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE packagings ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_blocks ENABLE ROW LEVEL SECURITY;

-- Public read policies for showcase
CREATE POLICY "Public products view" ON products FOR SELECT USING (active = true);
CREATE POLICY "Public certifications view" ON certifications FOR SELECT USING (active = true);
CREATE POLICY "Public packagings view" ON packagings FOR SELECT USING (is_active = true);
CREATE POLICY "Public site_settings view" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Public content_blocks view" ON content_blocks FOR SELECT USING (true);
CREATE POLICY "Public contact submission" ON contact_messages FOR INSERT WITH CHECK (true);
