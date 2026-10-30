import { NextRequest, NextResponse } from 'next/server';
import { loadDatabaseAsync, saveDatabaseAsync } from '@/lib/db/db';
import { validateAdminSession } from '@/lib/auth';
import { Packaging } from '@/lib/types';

export async function GET() {
  const db = await loadDatabaseAsync();
  return NextResponse.json(db.packagings || []);
}

export async function POST(request: NextRequest) {
  const session = await validateAdminSession(request);
  if (!session.valid) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { capacity, title, image_url, badge, description, sort_order, is_active = true, translations } = body;

    const db = await loadDatabaseAsync();
    const newPack: Packaging = {
      id: `pack-${Date.now()}`,
      capacity: capacity || '',
      title: title || 'Nouveau Format',
      image_url: image_url || '/images/packaging/ibc-container.jpg',
      badge: badge || '',
      description: description || '',
      sort_order: Number(sort_order || (db.packagings || []).length + 1),
      is_active,
      translations: translations || {
        fr: { title, description },
      },
    };

    if (!Array.isArray(db.packagings)) {
      db.packagings = [];
    }

    db.packagings.push(newPack);
    await saveDatabaseAsync(db);

    return NextResponse.json({ success: true, packaging: newPack });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur création conditionnement' }, { status: 500 });
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
    const pack = (db.packagings || []).find((p) => p.id === id);

    if (!pack) {
      return NextResponse.json({ error: 'Format introuvable' }, { status: 404 });
    }

    Object.assign(pack, updates);
    await saveDatabaseAsync(db);

    return NextResponse.json({ success: true, packaging: pack });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur mise à jour conditionnement' }, { status: 500 });
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
    db.packagings = (db.packagings || []).filter((p) => p.id !== id);
    await saveDatabaseAsync(db);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur suppression format' }, { status: 500 });
  }
}
