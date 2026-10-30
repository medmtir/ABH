import { NextRequest, NextResponse } from 'next/server';
import { loadDatabaseAsync, saveDatabaseAsync } from '@/lib/db/db';
import { validateAdminSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get('locale') || 'fr';

  const db = await loadDatabaseAsync();
  const block = (db.content_blocks || []).find((b) => b.locale === locale) ||
    db.content_blocks?.[0] || null;

  return NextResponse.json({
    block,
    settings: db.settings,
  });
}

export async function PUT(request: NextRequest) {
  const session = await validateAdminSession(request);
  if (!session.valid) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { block, settings } = body;

    const db = await loadDatabaseAsync();

    if (block && block.locale) {
      if (!Array.isArray(db.content_blocks)) {
        db.content_blocks = [];
      }
      const existingIdx = db.content_blocks.findIndex((b) => b.locale === block.locale);
      block.updated_at = new Date().toISOString();

      if (existingIdx >= 0) {
        db.content_blocks[existingIdx] = { ...db.content_blocks[existingIdx], ...block };
      } else {
        db.content_blocks.push(block);
      }
    }

    if (settings) {
      settings.updated_at = new Date().toISOString();
      db.settings = { ...db.settings, ...settings };
    }

    await saveDatabaseAsync(db);
    return NextResponse.json({ success: true, message: 'Enregistré' });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la sauvegarde' }, { status: 500 });
  }
}
