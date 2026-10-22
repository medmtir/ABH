import { NextRequest, NextResponse } from 'next/server';
import { validateAdminSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const session = await validateAdminSession(request);
  if (!session.valid) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const { text, source_lang = 'fr', target_lang } = await request.json();

    if (!text || !target_lang) {
      return NextResponse.json({ error: 'Texte et langue cible requis' }, { status: 400 });
    }

    if (source_lang === target_lang) {
      return NextResponse.json({ translated_text: text });
    }

    // Call MyMemory Free Translation API
    const langPair = `${source_lang}|${target_lang}`;
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${encodeURIComponent(langPair)}`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'ABH-Company-B2B/1.0',
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`MyMemory API error: ${response.status}`);
    }

    const data = await response.json();
    const translatedText = data.responseData?.translatedText;

    if (!translatedText) {
      return NextResponse.json({ translated_text: text });
    }

    return NextResponse.json({
      translated_text: translatedText,
    });
  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json(
      { error: 'Service de traduction temporairement indisponible.' },
      { status: 500 }
    );
  }
}
