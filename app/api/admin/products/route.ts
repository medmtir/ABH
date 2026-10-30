import { NextRequest, NextResponse } from 'next/server';
import { loadDatabaseAsync, saveDatabaseAsync } from '@/lib/db/db';
import { validateAdminSession } from '@/lib/auth';
import { Product } from '@/lib/types';

export async function GET() {
  const db = await loadDatabaseAsync();
  return NextResponse.json(db.products || []);
}

export async function POST(request: NextRequest) {
  const session = await validateAdminSession(request);
  if (!session.valid) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { slug, acidity_max, hero_image, gallery_images, specs, certifications, translations } = body;

    if (!slug) {
      return NextResponse.json({ error: 'Le slug du produit est obligatoire' }, { status: 400 });
    }

    const db = await loadDatabaseAsync();
    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      slug,
      active: true,
      acidity_max: Number(acidity_max || 0.8),
      hero_image: hero_image || '/images/placeholder-oil.jpg',
      gallery_images: gallery_images || [],
      specs: specs || {
        acidity: '≤ 0.8%',
        variety: 'Chemlali',
        extraction: 'Extraction à froid',
        origin: 'Bouhajla, Kairouan',
        packaging: 'Flexitank 24 000L',
        moq: '1 Conteneur 20ft',
      },
      certifications: certifications || ['ISO 22000', 'BIO'],
      translations: translations || {
        fr: { title: slug, subtitle: '', short_description: '', description: '' },
      },
      created_at: new Date().toISOString(),
    };

    if (!Array.isArray(db.products)) {
      db.products = [];
    }

    db.products.push(newProduct);
    await saveDatabaseAsync(db);

    return NextResponse.json({ success: true, product: newProduct });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur création produit' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const session = await validateAdminSession(request);
  if (!session.valid) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, ...updates } = body;

    const db = await loadDatabaseAsync();
    const product = (db.products || []).find((p) => p.id === id);

    if (!product) {
      return NextResponse.json({ error: 'Produit introuvable' }, { status: 404 });
    }

    Object.assign(product, updates);
    await saveDatabaseAsync(db);

    return NextResponse.json({ success: true, product });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur mise à jour produit' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = await validateAdminSession(request);
  if (!session.valid) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    const db = await loadDatabaseAsync();
    db.products = (db.products || []).filter((p) => p.id !== id);
    await saveDatabaseAsync(db);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur suppression produit' }, { status: 500 });
  }
}
