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

export const metadata: Metadata = {
  title: 'ABH Company | Authentic Bio Huile — Export Huiles Bio Tunisie',
  description: "Authentic Bio Huile Company (ABH), société de commerce international à Bouhajla (Kairouan). Exportation mondiale d'huiles d'olive extra vierges et biologiques en vrac.",
  keywords: "huile d'olive tunisie, export huile olive vrac, authentic bio huile company, bouhajla, kairouan, bio tunisie, flexitank",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://abh-company.com'),
  openGraph: {
    title: 'ABH Company — Authentic Bio Huile Company',
    description: "Exportation internationale d'huiles végétales & oléicoles tunisiennes d'excellence.",
    images: ['/images/logo.png'],
    type: 'website',
  },
  icons: {
    icon: '/images/logo.png',
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      dir="ltr"
      className={`${cormorant.variable} ${inter.variable} ${cairo.variable} scroll-smooth`}
    >
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
