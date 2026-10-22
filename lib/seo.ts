// ============================================================
// ABH Company — SEO Utilities
// ============================================================

import type { Metadata } from 'next';
import type { Locale } from '@/lib/types';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://abh-company.com';

const COMPANY = {
  name: 'Authentic Bio Huile Company',
  shortName: 'ABH',
  description: {
    fr: "Leader tunisien dans l'exportation B2B d'huiles d'olive biologiques et conventionnelles. Qualité certifiée BRC, ISO 22000, BIO.",
    en: 'Leading Tunisian B2B exporter of organic and conventional olive oils. BRC, ISO 22000, BIO certified quality.',
    ar: 'الشركة التونسية الرائدة في تصدير زيوت الزيتون العضوية والتقليدية بين الشركات. جودة معتمدة BRC, ISO 22000, BIO.',
    es: 'Líder tunecino en exportación B2B de aceites de oliva orgánicos y convencionales. Calidad certificada BRC, ISO 22000, BIO.',
    it: "Leader tunisino nell'esportazione B2B di oli d'oliva biologici e convenzionali. Qualità certificata BRC, ISO 22000, BIO.",
  } as Record<string, string>,
  keywords: {
    fr: "huile d'olive tunisienne, exportation huile bio, huile olive vrac, B2B huile olive, ABH Tunisie, huile olive biologique, huile olive extra vierge",
    en: 'Tunisian olive oil, organic olive oil export, bulk olive oil, B2B olive oil, ABH Tunisia, biological olive oil, extra virgin olive oil',
    ar: 'زيت زيتون تونسي, تصدير زيت زيتون عضوي, زيت زيتون بالجملة, ABH تونس',
    es: 'aceite de oliva tunecino, exportación aceite oliva orgánico, aceite oliva a granel, B2B aceite oliva',
    it: "olio d'oliva tunisino, esportazione olio d'oliva biologico, olio d'oliva sfuso, B2B olio d'oliva",
  } as Record<string, string>,
  address: 'N°46, Rue Tahar Sfar, Bouhajla 3180, Kairouan, Tunisie',
  email: 'contact@abh-company.com',
  phone: '+216 77 277 048',
};

interface GenerateMetadataOptions {
  locale?: Locale;
  title?: string;
  description?: string;
  path?: string;
  ogImage?: string;
  noIndex?: boolean;
}

export function generateMetadata({
  locale = 'fr',
  title,
  description,
  path = '',
  ogImage,
  noIndex = false,
}: GenerateMetadataOptions = {}): Metadata {
  const siteTitle = title
    ? `${title} | ${COMPANY.shortName}`
    : `${COMPANY.name} — ${locale === 'fr' ? "L'Excellence Bio Tunisienne" : 'Tunisian Bio Excellence'}`;

  const siteDescription = description || COMPANY.description[locale] || COMPANY.description.fr;
  const siteKeywords = COMPANY.keywords[locale] || COMPANY.keywords.fr;
  const canonicalUrl = `${BASE_URL}${path}`;
  const ogImageUrl = ogImage || `${BASE_URL}/images/og-default.jpg`;

  return {
    title: siteTitle,
    description: siteDescription,
    keywords: siteKeywords,
    authors: [{ name: COMPANY.name }],
    creator: COMPANY.name,
    publisher: COMPANY.name,
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'fr': `${BASE_URL}/fr${path}`,
        'en': `${BASE_URL}/en${path}`,
        'ar': `${BASE_URL}/ar${path}`,
        'es': `${BASE_URL}/es${path}`,
        'it': `${BASE_URL}/it${path}`,
      },
    },
    openGraph: {
      type: 'website',
      locale: locale === 'ar' ? 'ar_TN' : `${locale}_${locale === 'fr' ? 'FR' : locale === 'en' ? 'GB' : locale.toUpperCase()}`,
      url: canonicalUrl,
      siteName: COMPANY.name,
      title: siteTitle,
      description: siteDescription,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: COMPANY.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: siteTitle,
      description: siteDescription,
      images: [ogImageUrl],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { index: true, follow: true } },
  };
}

export function generateJsonLd(locale: Locale = 'fr') {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: COMPANY.name,
    alternateName: COMPANY.shortName,
    url: BASE_URL,
    logo: `${BASE_URL}/images/logo.png`,
    description: COMPANY.description[locale] || COMPANY.description.fr,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'N°46, Rue Tahar Sfar',
      addressLocality: 'Bouhajla',
      postalCode: '3180',
      addressRegion: 'Kairouan',
      addressCountry: 'TN',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: COMPANY.phone,
      email: COMPANY.email,
      contactType: 'sales',
      availableLanguage: ['French', 'English', 'Arabic'],
    },
    sameAs: [],
    foundingDate: '2020',
    numberOfEmployees: {
      '@type': 'QuantitativeValue',
      minValue: 10,
      maxValue: 50,
    },
    areaServed: {
      '@type': 'GeoShape',
      name: 'Worldwide B2B Export',
    },
    knowsAbout: [
      'Olive Oil Production',
      'Organic Certification',
      'B2B Export',
      'Food Safety',
      'Bulk Olive Oil',
    ],
  };
}
