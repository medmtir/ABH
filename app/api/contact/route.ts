import { NextRequest, NextResponse } from 'next/server';
import { loadDatabase, saveDatabase } from '@/lib/db/db';
import { ContactMessage } from '@/lib/types';

// Rate limiting in-memory map: IP -> timestamp array
const ipRequests = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS = 5;

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown-ip';
    const now = Date.now();

    // Check rate limit
    const timestamps = (ipRequests.get(ip) || []).filter((t) => now - t < RATE_LIMIT_WINDOW);
    if (timestamps.length >= MAX_REQUESTS) {
      return NextResponse.json(
        { error: 'Trop de requêtes. Veuillez patienter quelques minutes.' },
        { status: 429 }
      );
    }
    timestamps.push(now);
    ipRequests.set(ip, timestamps);

    const body = await request.json();

    // Honeypot check
    if (body.website_url) {
      // Silently succeed to trick bots
      return NextResponse.json({ success: true, message: 'Message reçu' });
    }

    const {
      full_name,
      company_name,
      country,
      email,
      phone,
      product_interest,
      quantity,
      destination_country,
      message,
      privacy_consent,
      file_attachment,
    } = body;

    if (!full_name || !company_name || !email || !message) {
      return NextResponse.json(
        { error: 'Veuillez remplir tous les champs obligatoires (*).' },
        { status: 400 }
      );
    }

    const db = loadDatabase();

    const newMessage: ContactMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      full_name,
      company_name,
      country: country || 'Non spécifié',
      email,
      phone: phone || '',
      product_interest: product_interest || "Huile d'Olive Vierge Extra",
      quantity: quantity || '',
      destination_country: destination_country || '',
      message,
      privacy_consent: !!privacy_consent,
      file_attachment: file_attachment || '',
      status: 'unread',
      created_at: new Date().toISOString(),
    };

    if (!Array.isArray(db.messages)) {
      db.messages = [];
    }

    db.messages.unshift(newMessage);
    saveDatabase(db);

    return NextResponse.json({
      success: true,
      message: 'Votre demande a bien été envoyée.',
      id: newMessage.id,
    });
  } catch (error) {
    console.error('Error in /api/contact:', error);
    return NextResponse.json(
      { error: 'Erreur lors du traitement du message.' },
      { status: 500 }
    );
  }
}
