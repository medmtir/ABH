import { NextRequest, NextResponse } from 'next/server';
import { loadDatabaseAsync, saveDatabaseAsync } from '@/lib/db/db';
import { validateAdminSession } from '@/lib/auth';
import { Publication } from '@/lib/types';

export async function GET() {
  const db = await loadDatabaseAsync();
  return NextResponse.json(db.publications || []);
}

export async function POST(request: NextRequest) {
  const session = await validateAdminSession(request);
  if (!session.valid) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { category = 'report', date, download_url, file_size, translations } = body;

    const db = await loadDatabaseAsync();
    const newPub: Publication = {
      id: `pub-${Date.now()}`,
      category,
      date: date || new Date().toISOString().split('T')[0],
      download_url: download_url || '',
      file_size: file_size || '',
      translations: translations || {
        fr: { title: 'Nouvelle Publication', summary: '', content: '' },
      },
      created_at: new Date().toISOString(),
    };

    if (!Array.isArray(db.publications)) {
      db.publications = [];
    }

    db.publications.unshift(newPub);
    await saveDatabaseAsync(db);

    return NextResponse.json({ success: true, publication: newPub });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur création publication' }, { status: 500 });
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
    const pub = (db.publications || []).find((p) => p.id === id);

    if (!pub) {
      return NextResponse.json({ error: 'Publication introuvable' }, { status: 404 });
    }

    Object.assign(pub, updates);
    await saveDatabaseAsync(db);

    return NextResponse.json({ success: true, publication: pub });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur mise à jour publication' }, { status: 500 });
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
    db.publications = (db.publications || []).filter((p) => p.id !== id);
    await saveDatabaseAsync(db);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur suppression publication' }, { status: 500 });
  }
}
