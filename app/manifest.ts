import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ABH Admin — Authentic Bio Huile',
    short_name: 'ABH Admin',
    description: "Portail d'administration et de gestion commerciale des commandes export ABH Company.",
    start_url: '/admin/dashboard',
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
