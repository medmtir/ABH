import { NextResponse } from 'next/server';
import { loadDatabase } from '@/lib/db/db';

export async function GET() {
  try {
    const db = loadDatabase();
    return NextResponse.json(db.settings);
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des paramètres' },
      { status: 500 }
    );
  }
}
