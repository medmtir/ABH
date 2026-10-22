'use client';

import React, { useState, useEffect } from 'react';
import { Save, CheckCircle2, PhoneCall, Building2, User, Share2 } from 'lucide-react';
import { ImageUploader } from '@/components/ui/ImageUploader';

export default function AdminContactsPage() {
  const [settings, setSettings] = useState<any>({
    company_name: '',
    tagline: '',
    address: '',
    general_email: '',
    general_phone: '',
    whatsapp: '',
    partners: [],
    social_links: {
      linkedin: { url: '', active: true },
      instagram: { url: '', active: true },
      facebook: { url: '', active: true },
      whatsapp: { url: '', active: true },
    },
  });
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/site-settings')
      .then((r) => r.json())
      .then((data) => {
        if (data) setSettings(data);
      })
      .finally(() => setLoading(false));
  }, []);

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
      <div>
        <h1 className="text-2xl font-heading font-bold text-abh-sapphire">
          Coordonnées du Siège & Partenaires Exécutifs
        </h1>
        <p className="text-xs text-abh-slate mt-0.5">
          Mettez à jour les coordonnées officielles, la fiche du gérant et les liens de réseaux sociaux.
        </p>
      </div>

      {saved && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-xs text-emerald-800 border border-emerald-200">
          <CheckCircle2 className="h-4 w-4" />
          <span>Paramètres de contact enregistrés avec succès !</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Siège social */}
        <div className="rounded-2xl bg-white p-6 border border-abh-border shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-abh-sapphire uppercase tracking-wider flex items-center gap-2">
            <Building2 className="h-4 w-4 text-abh-amber" />
            <span>Coordonnées Officielles du Siège Social</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">Raison Sociale</label>
              <input
                type="text"
                value={settings.company_name || ''}
                onChange={(e) => setSettings({ ...settings, company_name: e.target.value })}
                className="w-full rounded-xl border border-abh-border p-2.5"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Slogan Institutionnel</label>
              <input
                type="text"
                value={settings.tagline || ''}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full rounded-xl border border-abh-border p-2.5"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium mb-1">Adresse Complète du Siège</label>
            <input
              type="text"
              value={settings.address || ''}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              className="w-full rounded-xl border border-abh-border p-2.5"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-medium mb-1">Email Général</label>
              <input
                type="email"
                value={settings.general_email || ''}
                onChange={(e) => setSettings({ ...settings, general_email: e.target.value })}
                className="w-full rounded-xl border border-abh-border p-2.5"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Téléphone Principal</label>
              <input
                type="tel"
                value={settings.general_phone || ''}
                onChange={(e) => setSettings({ ...settings, general_phone: e.target.value })}
                className="w-full rounded-xl border border-abh-border p-2.5"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">WhatsApp Export</label>
              <input
                type="tel"
                value={settings.whatsapp || ''}
                onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                className="w-full rounded-xl border border-abh-border p-2.5"
              />
            </div>
          </div>
        </div>

        {/* Gérance / Partenaire */}
        <div className="rounded-2xl bg-white p-6 border border-abh-border shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-abh-sapphire uppercase tracking-wider flex items-center gap-2">
            <User className="h-4 w-4 text-abh-amber" />
            <span>Direction Exécutive & Gérance (RNE)</span>
          </h3>

          {settings.partners?.[0] && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-1">Nom & Prénom</label>
                <input
                  type="text"
                  value={settings.partners[0].name || ''}
                  onChange={(e) => {
                    const updated = [...settings.partners];
                    updated[0].name = e.target.value;
                    setSettings({ ...settings, partners: updated });
                  }}
                  className="w-full rounded-xl border border-abh-border p-2.5"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Titre / Qualité</label>
                <input
                  type="text"
                  value={settings.partners[0].role || ''}
                  onChange={(e) => {
                    const updated = [...settings.partners];
                    updated[0].role = e.target.value;
                    setSettings({ ...settings, partners: updated });
                  }}
                  className="w-full rounded-xl border border-abh-border p-2.5"
                />
              </div>
            </div>
          )}
        </div>

        {/* Social Links */}
        <div className="rounded-2xl bg-white p-6 border border-abh-border shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-abh-sapphire uppercase tracking-wider flex items-center gap-2">
            <Share2 className="h-4 w-4 text-abh-amber" />
            <span>Réseaux Sociaux Professionnels</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">LinkedIn URL</label>
              <input
                type="text"
                value={settings.social_links?.linkedin?.url || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    social_links: {
                      ...settings.social_links,
                      linkedin: { ...settings.social_links.linkedin, url: e.target.value },
                    },
                  })
                }
                className="w-full rounded-xl border border-abh-border p-2.5"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Instagram URL</label>
              <input
                type="text"
                value={settings.social_links?.instagram?.url || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    social_links: {
                      ...settings.social_links,
                      instagram: { ...settings.social_links.instagram, url: e.target.value },
                    },
                  })
                }
                className="w-full rounded-xl border border-abh-border p-2.5"
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
            <span>Enregistrer les Coordonnées</span>
          </button>
        </div>
      </form>
    </div>
  );
}
