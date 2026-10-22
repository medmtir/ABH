'use client';

import React, { useState } from 'react';
import { Languages, Loader2 } from 'lucide-react';

interface AutoTranslateButtonProps {
  sourceText: string;
  sourceLang?: string;
  targetLang: string;
  onTranslated: (translatedText: string) => void;
  className?: string;
}

export function AutoTranslateButton({
  sourceText,
  sourceLang = 'fr',
  targetLang,
  onTranslated,
  className = '',
}: AutoTranslateButtonProps) {
  const [translating, setTranslating] = useState(false);

  const handleTranslate = async () => {
    if (!sourceText.trim()) return;
    setTranslating(true);
    try {
      const res = await fetch('/api/admin/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: sourceText,
          source_lang: sourceLang,
          target_lang: targetLang,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.translated_text) {
          onTranslated(data.translated_text);
        }
      }
    } catch (err) {
      console.error('Translation error:', err);
    } finally {
      setTranslating(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleTranslate}
      disabled={translating || !sourceText.trim()}
      className={`inline-flex items-center gap-1.5 rounded-lg border border-abh-amber/30 bg-abh-sand/20 px-2 py-1 text-[11px] font-medium text-abh-amber hover:bg-abh-amber hover:text-white transition-colors disabled:opacity-40 ${className}`}
      title={`Traduire automatiquement vers ${targetLang.toUpperCase()}`}
    >
      {translating ? (
        <Loader2 className="h-3 w-3 animate-spin" />
      ) : (
        <Languages className="h-3 w-3" />
      )}
      <span>Auto-Traduction ({targetLang.toUpperCase()})</span>
    </button>
  );
}

export default AutoTranslateButton;
