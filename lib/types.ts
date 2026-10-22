// ============================================================
// ABH Company — Complete TypeScript Type Definitions
// ============================================================

// ----- Admin -----
export interface AdminUser {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  role: 'superadmin' | 'admin';
  created_at: string;
}

// ----- Products -----
export interface ProductTranslation {
  title: string;
  subtitle: string;
  description: string;
  short_description: string;
}

export interface ProductSpecs {
  acidity: string;
  variety: string;
  extraction: string;
  origin: string;
  packaging: string;
  moq: string;
}

export interface Product {
  id: string;
  slug: string;
  active: boolean;
  acidity_max: number;
  hero_image: string;
  gallery_images: string[];
  specs: ProductSpecs;
  certifications: string[];
  translations: Record<string, ProductTranslation>;
  created_at: string;
}

// ----- Certifications -----
export interface CertificationTranslation {
  name: string;
  issuer: string;
  description: string;
}

export interface Certification {
  id: string;
  slug: string;
  logo: string;
  active: boolean;
  expiry_date?: string;
  pdf_url?: string;
  translations: Record<string, CertificationTranslation>;
  created_at: string;
}

// ----- Publications -----
export interface PublicationTranslation {
  title: string;
  summary: string;
  content: string;
}

export interface Publication {
  id: string;
  category: 'analysis' | 'guide' | 'report';
  date: string;
  download_url?: string;
  file_size?: string;
  translations: Record<string, PublicationTranslation>;
  created_at: string;
}

// ----- Contact Messages / RFQ -----
export interface ContactMessage {
  id: string;
  full_name: string;
  company_name: string;
  country: string;
  email: string;
  phone: string;
  product_interest: string;
  quantity: string;
  destination_country: string;
  message: string;
  privacy_consent: boolean;
  file_attachment?: string;
  status: 'unread' | 'read' | 'contacted' | 'archived' | 'trash';
  admin_notes?: string;
  created_at: string;
  trashed_at?: string;
}

// ----- CRM: Clients -----
export interface Client {
  id: string;
  name: string;
  tax_id: string;
  contact_person: string;
  email: string;
  phone: string;
  country: string;
  address: string;
  notes: string;
  is_deleted: boolean;
  deleted_at?: string;
  created_at: string;
}

// ----- CRM: Orders -----
export interface Payment {
  id: string;
  date: string;
  amount: number;
  method: 'wire_transfer' | 'letter_of_credit' | 'check' | 'cash';
  reference: string;
  notes: string;
}

export interface DeliveryInstallment {
  id: string;
  date: string;
  quantity: number;
  bl_number: string;
  notes: string;
}

export type Currency = 'EUR' | 'TND' | 'USD';
export type OrderStatus = 'pending' | 'confirmed' | 'in_production' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'unpaid' | 'partial' | 'paid' | 'overpaid';
export type DeliveryStatus = 'pending' | 'partial' | 'delivered';

export interface Order {
  id: string;
  order_number: string;
  client_id: string;
  client_name: string;
  product_id: string;
  product_name: string;
  packaging: string;
  quantity: number;
  unit: 'tonnes' | 'liters' | 'kg';
  unit_price: number;
  currency: Currency;
  total_amount: number;
  paid_amount: number;
  remaining_amount: number;
  payment_status: PaymentStatus;
  order_status: OrderStatus;
  order_date: string;
  payments: Payment[];
  delivery_installments: DeliveryInstallment[];
  delivered_quantity: number;
  remaining_quantity: number;
  delivery_status: DeliveryStatus;
  is_deleted: boolean;
  deleted_at?: string;
  notes: string;
  created_at: string;
}

// ----- Packaging -----
export interface PackagingTranslation {
  title: string;
  description: string;
}

export interface Packaging {
  id: string;
  capacity: string;
  title: string;
  image_url: string;
  badge: string;
  description: string;
  sort_order: number;
  is_active: boolean;
  translations: Record<string, PackagingTranslation>;
}

// ----- Site Settings -----
export interface PartnerInfo {
  name: string;
  role: string;
  phone: string;
  email: string;
  photo: string;
  active: boolean;
}

export interface SocialLinks {
  linkedin: { url: string; active: boolean };
  instagram: { url: string; active: boolean };
  facebook: { url: string; active: boolean };
  youtube: { url: string; active: boolean };
  whatsapp: { url: string; active: boolean };
}

export interface SeoData {
  title: string;
  description: string;
  keywords: string;
  og_image: string;
}

export interface DeveloperCredit {
  name: string;
  whatsapp: string;
  email: string;
}

export interface SiteSettings {
  company_name: string;
  tagline: string;
  country: string;
  address: string;
  general_email: string;
  general_phone: string;
  whatsapp: string;
  developer_credit: DeveloperCredit;
  partners: PartnerInfo[];
  social_links: SocialLinks;
  seo: Record<string, SeoData>;
  google_site_verification?: string;
  bing_site_verification?: string;
  updated_at: string;
}

// ----- Content Blocks (i18n) -----
export interface ContentBlock {
  locale: string;
  hero_title: string;
  hero_subtitle: string;
  hero_badge: string;
  hero_cta_primary: string;
  hero_cta_secondary: string;
  about_title: string;
  about_subtitle: string;
  about_text: string;
  why_choose_title: string;
  why_choose_subtitle: string;
  export_title: string;
  export_subtitle: string;
  export_text: string;
  about_who_we_are: string;
  about_mission: string;
  about_vision: string;
  about_mill_heritage: string;
  updated_at: string;
}

// ----- Media -----
export interface MediaFile {
  id: string;
  name: string;
  url: string;
  size: string;
  type: string;
  created_at: string;
}

// ----- Database -----
export interface Database {
  admins: AdminUser[];
  products: Product[];
  certifications: Certification[];
  publications: Publication[];
  messages: ContactMessage[];
  clients: Client[];
  orders: Order[];
  packagings: Packaging[];
  settings: SiteSettings;
  content_blocks: ContentBlock[];
  media: MediaFile[];
}

// ----- Locale -----
export type Locale = 'fr' | 'en' | 'ar' | 'es' | 'it';

export interface LocaleConfig {
  code: Locale;
  name: string;
  flag: string;
  dir: 'ltr' | 'rtl';
}
