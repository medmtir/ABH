import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ABH Company — Authentic Bio Huile',
    short_name: 'ABH Company',
    description:
      "Authentic Bio Huile Company (ABH) — Société d'exportation internationale d'huiles d'olive extra vierges et biologiques de Tunisie.",
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'any',
    background_color: '#112013',
    theme_color: '#2B4C28',
    icons: [
      {
        src: '/images/logo.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any maskable' as any,
      },
      {
        src: '/images/logo.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable' as any,
      },
    ],
  };
}
