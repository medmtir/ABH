'use client';

import React, { useState, useEffect } from 'react';
import { Save, CheckCircle2 } from 'lucide-react';

export default function AdminExportContentPage() {
  const [locale, setLocale] = useState('fr');
  const [block, setBlock] = useState<any>({
    export_title: '',
    export_subtitle: '',
    export_text: '',
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/content?locale=${locale}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.block) setBlock(data.block);
      });
  }, [locale]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ block: { ...block, locale } }),
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
            Éditeur de Contenu — Logistique & Export
          </h1>
          <p className="text-xs text-abh-slate mt-0.5">
            Modifiez les textes relatifs aux terminaux portuaires, Flexitanks et Incoterms.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-abh-border text-xs">
          {['fr', 'en', 'ar', 'es', 'it'].map((l) => (
            <button
              key={l}
              onClick={() => setLocale(l)}
              className={`px-3 py-1.5 rounded-lg font-bold uppercase transition-colors ${
                locale === l ? 'bg-abh-sapphire text-white' : 'text-abh-slate'
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
          <span>Enregistré avec succès pour ({locale.toUpperCase()}) !</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        <div className="rounded-2xl bg-white p-6 border border-abh-border shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-abh-sapphire uppercase tracking-wider">
            Textes de la Section Logistique
          </h3>

          <div>
            <label className="block font-medium mb-1">Titre de la Section Export</label>
            <input
              type="text"
              value={block.export_title || ''}
              onChange={(e) => setBlock({ ...block, export_title: e.target.value })}
              className="w-full rounded-xl border border-abh-border p-2.5 font-heading text-sm"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Sous-Titre Départs Maritimes</label>
            <input
              type="text"
              value={block.export_subtitle || ''}
              onChange={(e) => setBlock({ ...block, export_subtitle: e.target.value })}
              className="w-full rounded-xl border border-abh-border p-2.5"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Texte Explicatif Fret & Incoterms</label>
            <textarea
              rows={4}
              value={block.export_text || ''}
              onChange={(e) => setBlock({ ...block, export_text: e.target.value })}
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
            <span>Enregistrer le Contenu</span>
          </button>
        </div>
      </form>
    </div>
  );
}
