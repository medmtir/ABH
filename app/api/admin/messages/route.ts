import { NextRequest, NextResponse } from 'next/server';
import {
  getContactMessagesDirect,
  updateContactMessageDirect,
  deleteContactMessageDirect,
} from '@/lib/db/db';
import { validateAdminSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const session = await validateAdminSession(request);
  if (!session.valid) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'all';

    const result = await getContactMessagesDirect(status);

    // Return both formatted object and backward-compatible properties
    return NextResponse.json({
      messages: result.messages,
      counts: result.counts,
    });
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

    if (!id) {
      return NextResponse.json({ error: 'Identifiant message manquant' }, { status: 400 });
    }

    const updated = await updateContactMessageDirect(id, { status, admin_notes });
    if (!updated) {
      return NextResponse.json({ error: 'Message introuvable' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: updated });
  } catch (error) {
    console.error('Error updating message:', error);
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

    if (!id) {
      return NextResponse.json({ error: 'Identifiant message manquant' }, { status: 400 });
    }

    await deleteContactMessageDirect(id, permanent);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting message:', error);
    return NextResponse.json({ error: 'Erreur de suppression' }, { status: 500 });
  }
}
