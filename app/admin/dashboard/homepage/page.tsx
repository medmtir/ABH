'use client';

import React, { useState, useEffect } from 'react';
import { Save, CheckCircle2, Globe, Sparkles } from 'lucide-react';
import { AutoTranslateButton } from '@/components/ui/AutoTranslateButton';

export default function AdminHomepageContentPage() {
  const [locale, setLocale] = useState('fr');
  const [block, setBlock] = useState<any>({
    hero_title: '',
    hero_subtitle: '',
    hero_badge: '',
    hero_cta_primary: '',
    hero_cta_secondary: '',
    why_choose_title: '',
    why_choose_subtitle: '',
  });
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/content?locale=${locale}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.block) {
          setBlock(data.block);
        }
      })
      .finally(() => setLoading(false));
  }, [locale]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          block: { ...block, locale },
        }),
      });

      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-abh-sapphire">
            Éditeur de Contenu — Page d Accueil
          </h1>
          <p className="text-xs text-abh-slate mt-0.5">
            Personnalisez les titres, slogans, badges et textes d accroche pour chaque langue.
          </p>
        </div>

        {/* Locale tabs */}
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-abh-border text-xs">
          {['fr', 'en', 'ar', 'es', 'it'].map((l) => (
            <button
              key={l}
              onClick={() => setLocale(l)}
              className={`px-3 py-1.5 rounded-lg font-bold uppercase transition-colors ${
                locale === l
                  ? 'bg-abh-sapphire text-white'
                  : 'text-abh-slate hover:text-abh-sapphire'
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {saved && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-xs text-emerald-800 border border-emerald-200">
          <CheckCircle2 className="h-4 w-4" />
          <span>Modifications enregistrées avec succès pour la langue ({locale.toUpperCase()}) !</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <div className="rounded-2xl bg-white p-6 border border-abh-border shadow-xs space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-abh-sapphire uppercase tracking-wider">
              Section Héro & Bannière Principale
            </h3>
            {locale !== 'fr' && (
              <AutoTranslateButton
                sourceText={block.hero_title}
                targetLang={locale}
                onTranslated={(txt) => setBlock({ ...block, hero_title: txt })}
              />
            )}
          </div>

          <div>
            <label className="block font-medium mb-1">Badge d En-tête (ex. Commerce International)</label>
            <input
              type="text"
              value={block.hero_badge || ''}
              onChange={(e) => setBlock({ ...block, hero_badge: e.target.value })}
              className="w-full rounded-xl border border-abh-border p-2.5 focus:outline-none focus:border-abh-amber"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Grand Titre Héro *</label>
            <input
              type="text"
              required
              value={block.hero_title || ''}
              onChange={(e) => setBlock({ ...block, hero_title: e.target.value })}
              className="w-full rounded-xl border border-abh-border p-2.5 focus:outline-none focus:border-abh-amber font-heading text-sm"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Sous-Titre Descriptif *</label>
            <textarea
              rows={3}
              required
              value={block.hero_subtitle || ''}
              onChange={(e) => setBlock({ ...block, hero_subtitle: e.target.value })}
              className="w-full rounded-xl border border-abh-border p-2.5 focus:outline-none focus:border-abh-amber"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">Bouton Principal (CTA 1)</label>
              <input
                type="text"
                value={block.hero_cta_primary || ''}
                onChange={(e) => setBlock({ ...block, hero_cta_primary: e.target.value })}
                className="w-full rounded-xl border border-abh-border p-2.5"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Bouton Secondaire (CTA 2)</label>
              <input
                type="text"
                value={block.hero_cta_secondary || ''}
                onChange={(e) => setBlock({ ...block, hero_cta_secondary: e.target.value })}
                className="w-full rounded-xl border border-abh-border p-2.5"
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 border border-abh-border shadow-xs space-y-4 text-xs">
          <h3 className="text-sm font-bold text-abh-sapphire uppercase tracking-wider">
            Section &quot;Pourquoi Choisir ABH ?&quot;
          </h3>

          <div>
            <label className="block font-medium mb-1">Titre de la Section</label>
            <input
              type="text"
              value={block.why_choose_title || ''}
              onChange={(e) => setBlock({ ...block, why_choose_title: e.target.value })}
              className="w-full rounded-xl border border-abh-border p-2.5"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Sous-Titre d Accompagnement</label>
            <input
              type="text"
              value={block.why_choose_subtitle || ''}
              onChange={(e) => setBlock({ ...block, why_choose_subtitle: e.target.value })}
              className="w-full rounded-xl border border-abh-border p-2.5"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-abh-sapphire px-6 py-3 text-xs font-semibold text-white shadow-md hover:bg-abh-midnight transition-colors"
          >
            <Save className="h-4 w-4 text-abh-amber" />
            <span>Enregistrer le Contenu ({locale.toUpperCase()})</span>
          </button>
        </div>
      </form>
    </div>
  );
}
