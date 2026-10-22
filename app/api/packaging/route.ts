import { NextResponse } from 'next/server';
import { loadDatabase } from '@/lib/db/db';

export async function GET() {
  try {
    const db = loadDatabase();
    const activePackagings = (db.packagings || [])
      .filter((p) => p.is_active)
      .sort((a, b) => a.sort_order - b.sort_order);

    return NextResponse.json(activePackagings);
  } catch (error) {
    console.error('Error fetching packaging formats:', error);
    return NextResponse.json(
      { error: 'Erreur lors du chargement des conditionnements' },
      { status: 500 }
    );
  }
}
