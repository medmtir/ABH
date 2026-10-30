import { NextRequest, NextResponse } from 'next/server';
import { insertContactMessageDirect } from '@/lib/db/db';
import { ContactMessage } from '@/lib/types';

// Rate limiting in-memory map: IP -> timestamp array
const ipRequests = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS = process.env.NODE_ENV === 'production' ? 20 : 100;

export async function POST(request: NextRequest) {
  try {
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const ip = forwarded?.split(',')[0].trim() || realIp || 'localhost-dev';
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

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        { error: 'Adresse email invalide.' },
        { status: 400 }
      );
    }

    // Payload length guards against DOS/exhaustion
    if (full_name.length > 150 || company_name.length > 150 || message.length > 5000) {
      return NextResponse.json(
        { error: 'La longueur du message ou des champs dépasse la limite autorisée.' },
        { status: 400 }
      );
    }

    const newMessage: ContactMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      full_name: full_name.trim().slice(0, 150),
      company_name: company_name.trim().slice(0, 150),
      country: (country || 'Non spécifié').trim().slice(0, 100),
      email: email.trim().toLowerCase().slice(0, 150),
      phone: (phone || '').trim().slice(0, 50),
      product_interest: (product_interest || "Huile d'Olive Vierge Extra").slice(0, 100),
      quantity: (quantity || '').trim().slice(0, 50),
      destination_country: (destination_country || '').trim().slice(0, 100),
      message: message.trim().slice(0, 5000),
      privacy_consent: !!privacy_consent,
      file_attachment: (file_attachment || '').slice(0, 500),
      status: 'unread',
      created_at: new Date().toISOString(),
    };

    // Instant insertion directly into Neon and memory sync
    await insertContactMessageDirect(newMessage);

    return NextResponse.json({
      success: true,
      message: 'Votre demande a bien été envoyée.',
      id: newMessage.id,
      data: newMessage,
    });
  } catch (error) {
    console.error('Error in /api/contact:', error);
    return NextResponse.json(
      { error: 'Erreur lors du traitement du message.' },
      { status: 500 }
    );
  }
}
