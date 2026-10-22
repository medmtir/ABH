import { MetadataRoute } from 'next';
import { loadDatabase } from '@/lib/db/db';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://abh-company.com';
  const now = new Date();

  const staticRoutes = [
    '',
    '/about',
    '/products',
    '/export',
    '/certifications',
    '/contact',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  try {
    const db = loadDatabase();
    const productRoutes = (db.products || [])
      .filter((p) => p.active)
      .map((p) => ({
        url: `${baseUrl}/products/${p.slug}`,
        lastModified: new Date(p.created_at || now),
        changeFrequency: 'monthly' as const,
        priority: 0.9,
      }));

    return [...staticRoutes, ...productRoutes];
  } catch {
    return staticRoutes;
  }
}
