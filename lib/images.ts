// ============================================================
// ABH Company — Image Path Mappings
// ============================================================

// ----- Facility Photos -----
export const facilityImages = {
  exterior: '/images/facility/exterior.jpg',
  production_line: '/images/facility/production-line.jpg',
  storage_tanks: '/images/facility/storage-tanks.jpg',
  laboratory: '/images/facility/laboratory.jpg',
  loading_dock: '/images/facility/loading-dock.jpg',
  olive_grove: '/images/facility/olive-grove.jpg',
  pressing_room: '/images/facility/pressing-room.jpg',
  bottling_area: '/images/facility/bottling-area.jpg',
} as const;

// ----- Product Photos -----
export const productImages = {
  extra_vierge: {
    hero: '/images/products/extra-vierge-hero.jpg',
    gallery: [
      '/images/products/extra-vierge-1.jpg',
      '/images/products/extra-vierge-2.jpg',
      '/images/products/extra-vierge-3.jpg',
    ],
  },
  bio: {
    hero: '/images/products/bio-hero.jpg',
    gallery: [
      '/images/products/bio-1.jpg',
      '/images/products/bio-2.jpg',
      '/images/products/bio-3.jpg',
    ],
  },
  raffinee: {
    hero: '/images/products/raffinee-hero.jpg',
    gallery: [
      '/images/products/raffinee-1.jpg',
      '/images/products/raffinee-2.jpg',
      '/images/products/raffinee-3.jpg',
    ],
  },
  grignons: {
    hero: '/images/products/grignons-hero.jpg',
    gallery: [
      '/images/products/grignons-1.jpg',
      '/images/products/grignons-2.jpg',
      '/images/products/grignons-3.jpg',
    ],
  },
} as const;

// ----- Certification Logos -----
export const certificationLogos = {
  brc: '/images/certifications/brc-food.png',
  iso_22000: '/images/certifications/iso-22000.png',
  ifs: '/images/certifications/ifs-food.png',
  bio: '/images/certifications/bio-organic.png',
  halal: '/images/certifications/halal.png',
  kosher: '/images/certifications/kosher.png',
} as const;

// ----- Packaging Photos -----
export const packagingImages = {
  flexitank: '/images/packaging/flexitank.jpg',
  ibc: '/images/packaging/ibc-container.jpg',
  drum: '/images/packaging/steel-drum.jpg',
  pail: '/images/packaging/pehd-pail.jpg',
} as const;

// ----- Hero & Banner Images -----
export const heroImages = {
  home: '/images/hero/home-hero.jpg',
  about: '/images/hero/about-hero.jpg',
  products: '/images/hero/products-hero.jpg',
  certifications: '/images/hero/certifications-hero.jpg',
  export: '/images/hero/export-hero.jpg',
  contact: '/images/hero/contact-hero.jpg',
} as const;

// ----- Logo & Branding -----
export const brandImages = {
  logo: '/images/logo.png',
  logo_white: '/images/logo-white.png',
  logo_icon: '/images/logo-icon.png',
  favicon: '/images/favicon.ico',
  og_default: '/images/og-default.jpg',
} as const;

// ----- Partner Photos -----
export const partnerImages = {
  badi_ammari: '/images/partners/badi-ammari.jpg',
} as const;

// ----- Placeholder / Fallback -----
export const placeholderImage = '/images/placeholder.jpg';

/**
 * Get image path with fallback to placeholder if the source is empty.
 */
export function getImageSrc(src: string | undefined | null): string {
  return src && src.trim().length > 0 ? src : placeholderImage;
}
