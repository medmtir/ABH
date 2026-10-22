import { NextRequest, NextResponse } from 'next/server';
import { loadDatabase, saveDatabase } from '@/lib/db/db';
import { validateAdminSession } from '@/lib/auth';
import { Certification } from '@/lib/types';

export async function GET() {
  const db = loadDatabase();
  return NextResponse.json(db.certifications || []);
}

export async function POST(request: NextRequest) {
  const session = await validateAdminSession(request);
  if (!session.valid) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { slug, logo, active = true, expiry_date, pdf_url, translations } = body;

    const db = loadDatabase();
    const newCert: Certification = {
      id: `cert-${Date.now()}`,
      slug: slug || `cert-${Date.now()}`,
      logo: logo || '/images/certs/iso22000.svg',
      active,
      expiry_date,
      pdf_url,
      translations: translations || {
        fr: { name: 'Nouvelle Certification', issuer: '', description: '' },
      },
      created_at: new Date().toISOString(),
    };

    if (!Array.isArray(db.certifications)) {
      db.certifications = [];
    }

    db.certifications.push(newCert);
    saveDatabase(db);

    return NextResponse.json({ success: true, certification: newCert });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur création certification' }, { status: 500 });
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

    const db = loadDatabase();
    const cert = (db.certifications || []).find((c) => c.id === id);

    if (!cert) {
      return NextResponse.json({ error: 'Certification introuvable' }, { status: 404 });
    }

    Object.assign(cert, updates);
    saveDatabase(db);

    return NextResponse.json({ success: true, certification: cert });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur mise à jour certification' }, { status: 500 });
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

    const db = loadDatabase();
    db.certifications = (db.certifications || []).filter((c) => c.id !== id);
    saveDatabase(db);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur suppression certification' }, { status: 500 });
  }
}
