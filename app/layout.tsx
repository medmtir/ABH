import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Inter, Cairo } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/lib/i18n/context';
import { SiteSettingsProvider } from '@/lib/context/site-settings-context';
import { SpeedInsights } from '@vercel/speed-insights/next';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-cairo',
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.abh-company.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ABH Company | Authentic Bio Huile — Export Huile d'Olive Tunisie",
    template: '%s | ABH Company',
  },
  description:
    "Authentic Bio Huile Company (ABH), société de commerce international à Bouhajla (Kairouan). Exportation mondiale d'huiles d'olive extra vierges et biologiques de Tunisie en vrac (Flexitanks, IBC, Fûts).",
  keywords: [
    'ABH Company',
    'ABH',
    'Authentic Bio Huile',
    'Authentic Bio Huile Company',
    'شركة الأصالة للزيوت الحيوية',
    'huile d olive tunisie',
    'export huile olive vrac',
    'bulk olive oil tunisia',
    'organic olive oil tunisia',
    'extra virgin olive oil tunisia',
    'bouhajla',
    'kairouan',
    'grossiste huile olive',
    'flexitank olive oil tunisia',
    'تصدير زيت الزيتون التونسي',
    'زيت زيتون بكر ممتاز',
    'زيت زيتون بيولوجي تونس',
  ],
  authors: [{ name: 'Authentic Bio Huile Company (ABH)', url: siteUrl }],
  creator: 'ABH Company',
  publisher: 'Authentic Bio Huile Company',
  category: 'International Trade / Agroalimentaire',
  alternates: {
    canonical: siteUrl,
    languages: {
      'fr-TN': siteUrl,
      'en-US': siteUrl,
      'ar-TN': siteUrl,
      'x-default': siteUrl,
    },
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'ABH Company',
  },
  openGraph: {
    title: "ABH Company | Authentic Bio Huile — Export Huile d'Olive Tunisie",
    description:
      "Exportation mondiale d'huiles d'olive extra vierges et biologiques tunisiennes d'excellence en vrac (Flexitanks, IBC, Fûts). Certifications internationales BRC, ISO, BIO.",
    url: siteUrl,
    siteName: 'ABH Company',
    locale: 'fr_FR',
    type: 'website',
    images: [
      {
        url: '/images/logo.png',
        width: 1200,
        height: 630,
        alt: 'ABH Company — Authentic Bio Huile Tunisie',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ABH Company — Authentic Bio Huile Company',
    description:
      "Exportation internationale d'huiles d'olive extra vierges et biologiques tunisiennes d'excellence en vrac.",
    images: ['/images/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon.png', type: 'image/png' },
    ],
    apple: '/images/logo.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#2B4C28',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': ['Corporation', 'LocalBusiness'],
      '@id': `${siteUrl}/#organization`,
      name: 'Authentic Bio Huile Company',
      legalName: 'Authentic Bio Huile Company (ABH)',
      alternateName: [
        'ABH Company',
        'ABH',
        'ABH Bio Huile',
        'Authentic Bio Huile',
        'شركة الأصالة للزيوت الحيوية',
      ],
      url: siteUrl,
      logo: {
        '@type': 'ImageObject',
        '@id': `${siteUrl}/#logo`,
        url: `${siteUrl}/images/logo.png`,
        caption: 'ABH Company Logo',
      },
      image: `${siteUrl}/images/logo.png`,
      description:
        "Société de commerce international basée à Bouhajla (Kairouan, Tunisie), spécialisée dans l'exportation mondiale d'huiles d'olive extra vierges et biologiques de haute qualité en vrac.",
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'N°46, Rue Tahar Sfar',
        addressLocality: 'Bouhajla',
        addressRegion: 'Kairouan',
        postalCode: '3180',
        addressCountry: 'TN',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 35.3992,
        longitude: 10.0478,
      },
      hasMap: 'https://maps.google.com/?q=35.3992,10.0478',
      telephone: '+216 70 248 170',
      email: 'contact@abh-company.com',
      priceRange: '$$$',
      currenciesAccepted: 'EUR, USD, TND',
      paymentAccepted: 'Bank Wire Transfer, Letter of Credit (L/C)',
      areaServed: [
        { '@type': 'Country', name: 'Tunisia' },
        { '@type': 'Country', name: 'France' },
        { '@type': 'Country', name: 'Spain' },
        { '@type': 'Country', name: 'Italy' },
        { '@type': 'Country', name: 'United States' },
        { '@type': 'Country', name: 'United Arab Emirates' },
        { '@type': 'Country', name: 'Saudi Arabia' },
      ],
      contactPoint: [
        {
          '@type': 'ContactPoint',
          telephone: '+216 70 248 170',
          contactType: 'sales',
          availableLanguage: ['French', 'English', 'Arabic', 'Italian', 'Spanish'],
        },
      ],
      sameAs: [
        'https://linkedin.com/company/abh-bio-huile',
        'https://instagram.com/abh_bio_huile',
        'https://facebook.com/abh.bio.huile',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      url: siteUrl,
      name: 'ABH Company',
      alternateName: 'Authentic Bio Huile Company',
      publisher: {
        '@id': `${siteUrl}/#organization`,
      },
      inLanguage: ['fr', 'en', 'ar', 'es', 'it'],
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fr"
      dir="ltr"
      className={`${cormorant.variable} ${inter.variable} ${cairo.variable} scroll-smooth`}
    >
      <head>
        {/* GEO & Local Location Tags */}
        <meta name="geo.region" content="TN-41" />
        <meta name="geo.placename" content="Bouhajla, Kairouan, Tunisie" />
        <meta name="geo.position" content="35.3992;10.0478" />
        <meta name="ICBM" content="35.3992, 10.0478" />
        <meta name="format-detection" content="telephone=yes, address=yes, email=yes" />

        {/* Structured Data (JSON-LD) for Search Engines */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />
      </head>
      <body className="min-h-screen bg-abh-pearl text-abh-midnight antialiased selection:bg-abh-amber selection:text-white">
        <SiteSettingsProvider>
          <LanguageProvider>
            {children}
            <SpeedInsights />
          </LanguageProvider>
        </SiteSettingsProvider>
      </body>
    </html>
  );
}
