import { NextRequest, NextResponse } from 'next/server';
import { loadDatabase, saveDatabase } from '@/lib/db/db';
import { validateAdminSession } from '@/lib/auth';
import { Client } from '@/lib/types';

export async function GET(request: NextRequest) {
  const session = await validateAdminSession(request);
  if (!session.valid) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const db = loadDatabase();
  const { searchParams } = new URL(request.url);
  const includeDeleted = searchParams.get('trash') === 'true';

  let clients = db.clients || [];
  if (includeDeleted) {
    clients = clients.filter((c) => c.is_deleted);
  } else {
    clients = clients.filter((c) => !c.is_deleted);
  }

  return NextResponse.json(clients);
}

export async function POST(request: NextRequest) {
  const session = await validateAdminSession(request);
  if (!session.valid) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, tax_id, contact_person, email, phone, country, address, notes } = body;

    if (!name || !country) {
      return NextResponse.json({ error: 'Nom et pays obligatoires' }, { status: 400 });
    }

    const db = loadDatabase();
    const newClient: Client = {
      id: `cli-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name,
      tax_id: tax_id || '',
      contact_person: contact_person || '',
      email: email || '',
      phone: phone || '',
      country,
      address: address || '',
      notes: notes || '',
      is_deleted: false,
      created_at: new Date().toISOString(),
    };

    if (!Array.isArray(db.clients)) {
      db.clients = [];
    }

    db.clients.unshift(newClient);
    saveDatabase(db);

    return NextResponse.json({ success: true, client: newClient });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur création client' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const session = await validateAdminSession(request);
  if (!session.valid) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, restore, ...updates } = body;

    const db = loadDatabase();
    const client = (db.clients || []).find((c) => c.id === id);

    if (!client) {
      return NextResponse.json({ error: 'Client introuvable' }, { status: 404 });
    }

    if (restore) {
      client.is_deleted = false;
      client.deleted_at = undefined;
    } else {
      Object.assign(client, updates);
    }

    saveDatabase(db);
    return NextResponse.json({ success: true, client });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur mise à jour client' }, { status: 500 });
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
      db.clients = (db.clients || []).filter((c) => c.id !== id);
    } else {
      const client = (db.clients || []).find((c) => c.id === id);
      if (client) {
        client.is_deleted = true;
        client.deleted_at = new Date().toISOString();
      }
    }

    saveDatabase(db);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur suppression' }, { status: 500 });
  }
}
