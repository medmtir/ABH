import { NextRequest, NextResponse } from 'next/server';
import { loadDatabase, saveDatabase } from '@/lib/db/db';
import { validateAdminSession } from '@/lib/auth';

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export async function GET(request: NextRequest) {
  const session = await validateAdminSession(request);
  if (!session.valid) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const db = loadDatabase();
    const now = Date.now();

    // Auto-purge trash older than 7 days
    if (Array.isArray(db.messages)) {
      db.messages = db.messages.filter((msg) => {
        if (msg.status === 'trash' && msg.trashed_at) {
          const trashedTime = new Date(msg.trashed_at).getTime();
          return now - trashedTime < SEVEN_DAYS_MS;
        }
        return true;
      });
      saveDatabase(db);
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let messages = db.messages || [];
    if (status && status !== 'all') {
      messages = messages.filter((m) => m.status === status);
    }

    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Erreur lors du chargement des messages' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const session = await validateAdminSession(request);
  if (!session.valid) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, status, admin_notes } = body;

    const db = loadDatabase();
    const message = (db.messages || []).find((m) => m.id === id);

    if (!message) {
      return NextResponse.json({ error: 'Message introuvable' }, { status: 404 });
    }

    if (status) {
      message.status = status;
      if (status === 'trash') {
        message.trashed_at = new Date().toISOString();
      } else {
        message.trashed_at = undefined;
      }
    }

    if (admin_notes !== undefined) {
      message.admin_notes = admin_notes;
    }

    saveDatabase(db);
    return NextResponse.json({ success: true, message });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la mise à jour' }, { status: 500 });
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
    const permanent = searchParams.get('permanent') === 'true';

    const db = loadDatabase();
    if (permanent) {
      db.messages = (db.messages || []).filter((m) => m.id !== id);
    } else {
      const msg = (db.messages || []).find((m) => m.id === id);
      if (msg) {
        msg.status = 'trash';
        msg.trashed_at = new Date().toISOString();
      }
    }

    saveDatabase(db);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur de suppression' }, { status: 500 });
  }
}
