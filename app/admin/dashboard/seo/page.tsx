'use client';

import React, { useState, useEffect } from 'react';
import { Save, CheckCircle2, Search, Globe2 } from 'lucide-react';

export default function AdminSeoPage() {
  const [locale, setLocale] = useState('fr');
  const [settings, setSettings] = useState<any>({
    seo: {
      fr: { title: '', description: '', keywords: '', og_image: '' },
      en: { title: '', description: '', keywords: '', og_image: '' },
      ar: { title: '', description: '', keywords: '', og_image: '' },
      es: { title: '', description: '', keywords: '', og_image: '' },
      it: { title: '', description: '', keywords: '', og_image: '' },
    },
    google_site_verification: '',
    bing_site_verification: '',
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/site-settings')
      .then((r) => r.json())
      .then((data) => {
        if (data) setSettings(data);
      });
  }, []);

  const currentSeo = settings.seo?.[locale] || { title: '', description: '', keywords: '', og_image: '' };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings }),
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
            Optimisation SEO & Balises Méta Multilingues
          </h1>
          <p className="text-xs text-abh-slate mt-0.5">
            Configurez les balises OpenGraph, mots-clés et codes de vérification des moteurs de recherche.
          </p>
        </div>

        {/* Locale Selector */}
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
          <span>Paramètres SEO enregistrés avec succès pour ({locale.toUpperCase()}) !</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Metas for active locale */}
        <div className="rounded-2xl bg-white p-6 border border-abh-border shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-abh-sapphire uppercase tracking-wider flex items-center gap-2">
            <Search className="h-4 w-4 text-abh-amber" />
            <span>Balises Méta pour la Langue ({locale.toUpperCase()})</span>
          </h3>

          <div>
            <label className="block font-medium mb-1">Titre de la Page (Meta Title) *</label>
            <input
              type="text"
              required
              value={currentSeo.title}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  seo: {
                    ...settings.seo,
                    [locale]: { ...currentSeo, title: e.target.value },
                  },
                })
              }
              className="w-full rounded-xl border border-abh-border p-2.5"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Meta Description *</label>
            <textarea
              rows={3}
              required
              value={currentSeo.description}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  seo: {
                    ...settings.seo,
                    [locale]: { ...currentSeo, description: e.target.value },
                  },
                })
              }
              className="w-full rounded-xl border border-abh-border p-2.5"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Mots-clés Séparés par des Virgules</label>
            <input
              type="text"
              value={currentSeo.keywords}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  seo: {
                    ...settings.seo,
                    [locale]: { ...currentSeo, keywords: e.target.value },
                  },
                })
              }
              className="w-full rounded-xl border border-abh-border p-2.5"
            />
          </div>
        </div>

        {/* Verification tags */}
        <div className="rounded-2xl bg-white p-6 border border-abh-border shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-abh-sapphire uppercase tracking-wider flex items-center gap-2">
            <Globe2 className="h-4 w-4 text-abh-amber" />
            <span>Vérification Google Search Console & Bing</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">Code Google Site Verification</label>
              <input
                type="text"
                value={settings.google_site_verification || ''}
                onChange={(e) => setSettings({ ...settings, google_site_verification: e.target.value })}
                className="w-full rounded-xl border border-abh-border p-2.5 font-mono"
                placeholder="ex. google-site-verification=xxxx"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Code Bing Webmaster</label>
              <input
                type="text"
                value={settings.bing_site_verification || ''}
                onChange={(e) => setSettings({ ...settings, bing_site_verification: e.target.value })}
                className="w-full rounded-xl border border-abh-border p-2.5 font-mono"
              />
            </div>
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-abh-sapphire px-6 py-3 text-xs font-semibold text-white shadow-md hover:bg-abh-midnight transition-colors"
          >
            <Save className="h-4 w-4 text-abh-amber" />
            <span>Enregistrer les Métadonnées</span>
          </button>
        </div>
      </form>
    </div>
  );
}
