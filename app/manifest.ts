import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ABH — Authentic Bio Huile Company',
    short_name: 'ABH Company',
    description: "Exportation internationale d'huiles d'olive et huiles bio tunisiennes de haute qualité.",
    start_url: '/',
    display: 'standalone',
    background_color: '#F8FAF6',
    theme_color: '#2B4C28',
    icons: [
      {
        src: '/images/logo.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/images/logo.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
