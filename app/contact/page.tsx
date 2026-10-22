'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import {
  MapPin,
  Phone,
  Mail,
  Send,
  Building2,
  FileCheck,
  CheckCircle2,
  AlertCircle,
  FileUp,
  Sparkles,
  Globe2,
} from 'lucide-react';
import { COUNTRIES_LIST } from '@/components/ui/QuoteModal';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    full_name: '',
    company_name: '',
    country: 'Tunisie (+216)',
    email: '',
    phone: '',
    product_interest: "Huile d'Olive Vierge Extra",
    quantity: '1 Conteneur 20ft (~21 Tonnes)',
    destination_country: '',
    message: '',
    privacy_consent: true,
    website_url: '', // Honeypot
  });

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (formData.website_url) {
      setSuccess(true);
      setLoading(false);
      return;
    }

    try {
      let attachmentUrl = '';
      if (file) {
        const uploadData = new FormData();
        uploadData.append('file', file);
        const uploadRes = await fetch('/api/admin/upload', {
          method: 'POST',
          body: uploadData,
        });
        if (uploadRes.ok) {
          const resJson = await uploadRes.json();
          attachmentUrl = resJson.url || '';
        }
      }

      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          file_attachment: attachmentUrl,
        }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || 'Erreur lors de l envoi');
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Impossible d envoyer la demande. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <main className="min-h-screen pt-28 pb-24 bg-abh-pearl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 rounded-full bg-abh-sand/60 px-3.5 py-1 text-xs font-semibold text-abh-sapphire mb-3">
              <Sparkles className="h-3.5 w-3.5 text-abh-amber" />
              <span>Contact & Devis Export B2B</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-heading font-bold text-abh-sapphire">
              Engagez votre Approvisionnement avec ABH
            </h1>
            <p className="text-sm sm:text-base text-abh-slate mt-3 leading-relaxed">
              Pour toute demande de prix, envoi d échantillons sous scellés ou étude de faisabilité logistique, notre équipe commerciale export vous répond sous 24 heures ouvrées.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left: Contact Info & RNE card */}
            <div className="lg:col-span-5 space-y-6">
              <div className="rounded-2xl bg-white p-6 sm:p-8 border border-abh-border shadow-premium space-y-6">
                <div>
                  <h3 className="text-xl font-heading font-bold text-abh-sapphire mb-1">
                    Siège Social & Exploitation
                  </h3>
                  <p className="text-xs text-abh-slate">
                    Authentic Bio Huile Company (SARL)
                  </p>
                </div>

                <div className="space-y-4 text-xs text-abh-slate">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-abh-sand/40 text-abh-amber">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="font-bold text-abh-midnight block">Adresse Officielle :</span>
                      <span>N°46, Rue Tahar Sfar, Bouhajla 3180</span>
                      <span className="block text-abh-copper font-medium">Gouvernorat de Kairouan, Tunisie</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-abh-sand/40 text-abh-amber">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="font-bold text-abh-midnight block">Lignes Téléphoniques :</span>
                      <span>+216 70 248 170 / +216 70 248 172</span>
                      <span className="block text-emerald-600 font-medium">WhatsApp Export : +216 50 000 000</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-abh-sand/40 text-abh-amber">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="font-bold text-abh-midnight block">Courriers Électroniques :</span>
                      <span>contact@abh-company.com</span>
                      <span className="block text-abh-slate">export@abh-company.com</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-abh-border/70 space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-abh-amber block">
                    Registre Légal & Statut Fiscal
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2 rounded-lg bg-abh-pearl/50 border border-abh-border/40">
                      <span className="text-gray-400 block text-[9px]">ID Unique RNE :</span>
                      <span className="font-mono font-bold text-abh-sapphire">1956962P</span>
                    </div>
                    <div className="p-2 rounded-lg bg-abh-pearl/50 border border-abh-border/40">
                      <span className="text-gray-400 block text-[9px]">Capital Social :</span>
                      <span className="font-bold text-abh-sapphire">20 000 TND</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Operating hours */}
              <div className="rounded-2xl bg-white p-6 border border-abh-border shadow-xs text-xs space-y-2">
                <h4 className="font-bold text-abh-sapphire">Horaires du Département Export</h4>
                <div className="flex justify-between text-abh-slate">
                  <span>Du Lundi au Vendredi :</span>
                  <span className="font-semibold text-abh-midnight">08h00 – 18h00 (GMT+1)</span>
                </div>
                <div className="flex justify-between text-abh-slate">
                  <span>Samedi :</span>
                  <span className="font-semibold text-abh-midnight">08h00 – 13h00 (GMT+1)</span>
                </div>
              </div>
            </div>

            {/* Right: RFQ Form */}
            <div className="lg:col-span-7">
              <div className="rounded-2xl bg-white p-6 sm:p-8 border border-abh-border shadow-premium">
                {success ? (
                  <div className="py-16 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mb-4 ring-8 ring-emerald-50/50">
                      <CheckCircle2 className="h-8 w-8" />
                    </div>
                    <h3 className="text-2xl font-heading font-bold text-abh-sapphire mb-2">
                      Demande Transmise avec Succès
                    </h3>
                    <p className="text-xs sm:text-sm text-abh-slate max-w-md mx-auto mb-6">
                      Merci d avoir contacté Authentic Bio Huile Company. Notre département export examine votre requête et prendra contact avec vous sous 24h.
                    </p>
                    <button
                      onClick={() => setSuccess(false)}
                      className="rounded-xl bg-abh-sapphire px-6 py-2.5 text-xs font-semibold text-white hover:bg-abh-midnight transition-colors"
                    >
                      Envoyer un autre message
                    </button>
                  </div>
                ) : (
                  <>
                    <h3 className="text-xl font-heading font-bold text-abh-sapphire mb-1">
                      Formulaire Officiel de Cotation (RFQ)
                    </h3>
                    <p className="text-xs text-abh-slate mb-6">
                      Remplissez les champs ci-dessous pour recevoir une offre FOB ou CIF adaptée.
                    </p>

                    {error && (
                      <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs text-red-700 border border-red-200">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <span>{error}</span>
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                      {/* Honeypot */}
                      <input
                        type="text"
                        name="website_url"
                        value={formData.website_url}
                        onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                        className="hidden"
                        tabIndex={-1}
                      />

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-abh-midnight mb-1">
                            Nom & Prénom *
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.full_name}
                            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                            className="w-full rounded-xl border border-abh-border bg-abh-pearl/40 px-3.5 py-2.5 text-xs focus:border-abh-amber focus:bg-white focus:outline-none"
                            placeholder="ex. Karim Ben Ammar"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-abh-midnight mb-1">
                            Raison Sociale / Société *
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.company_name}
                            onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                            className="w-full rounded-xl border border-abh-border bg-abh-pearl/40 px-3.5 py-2.5 text-xs focus:border-abh-amber focus:bg-white focus:outline-none"
                            placeholder="ex. AgriTrade Europe S.A."
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-abh-midnight mb-1">
                            Email Professionnel *
                          </label>
                          <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full rounded-xl border border-abh-border bg-abh-pearl/40 px-3.5 py-2.5 text-xs focus:border-abh-amber focus:bg-white focus:outline-none"
                            placeholder="import@agritrade.com"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-abh-midnight mb-1">
                            Téléphone / WhatsApp
                          </label>
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full rounded-xl border border-abh-border bg-abh-pearl/40 px-3.5 py-2.5 text-xs focus:border-abh-amber focus:bg-white focus:outline-none"
                            placeholder="+33 1 23 45 67 89"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-abh-midnight mb-1">
                            Pays du Siège Social *
                          </label>
                          <select
                            value={formData.country}
                            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                            className="w-full rounded-xl border border-abh-border bg-abh-pearl/40 px-3.5 py-2.5 text-xs focus:border-abh-amber focus:bg-white focus:outline-none"
                          >
                            {COUNTRIES_LIST.map((c) => (
                              <option key={c.code} value={c.name}>
                                {c.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-abh-midnight mb-1">
                            Port de Destination Souhaité
                          </label>
                          <input
                            type="text"
                            value={formData.destination_country}
                            onChange={(e) => setFormData({ ...formData, destination_country: e.target.value })}
                            className="w-full rounded-xl border border-abh-border bg-abh-pearl/40 px-3.5 py-2.5 text-xs focus:border-abh-amber focus:bg-white focus:outline-none"
                            placeholder="ex. Port de Gênes / Rotterdam"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-abh-midnight mb-1">
                            Produit d Intérêt *
                          </label>
                          <select
                            value={formData.product_interest}
                            onChange={(e) => setFormData({ ...formData, product_interest: e.target.value })}
                            className="w-full rounded-xl border border-abh-border bg-abh-pearl/40 px-3.5 py-2.5 text-xs focus:border-abh-amber focus:bg-white focus:outline-none"
                          >
                            <option value="Huile d'Olive Vierge Extra">Huile d Olive Vierge Extra (≤ 0.8%)</option>
                            <option value="Huile d'Olive Biologique Certifiée">Huile d Olive Biologique Certifiée (≤ 0.5%)</option>
                            <option value="Huile d'Olive Raffinée">Huile d Olive Raffinée (≤ 0.3%)</option>
                            <option value="Huile de Grignons d'Olive">Huile de Grignons d Olive (≤ 1.0%)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-abh-midnight mb-1">
                            Quantité Prévue
                          </label>
                          <input
                            type="text"
                            value={formData.quantity}
                            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                            className="w-full rounded-xl border border-abh-border bg-abh-pearl/40 px-3.5 py-2.5 text-xs focus:border-abh-amber focus:bg-white focus:outline-none"
                            placeholder="ex. 1 Conteneur 20ft (~21 Tonnes)"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-abh-midnight mb-1">
                          Message & Spécifications Contractuelles *
                        </label>
                        <textarea
                          rows={4}
                          required
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          className="w-full rounded-xl border border-abh-border bg-abh-pearl/40 px-3.5 py-2.5 text-xs focus:border-abh-amber focus:bg-white focus:outline-none"
                          placeholder="Indiquez vos besoins particuliers en termes d acidité, certifications exigées, fréquence d expédition..."
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-abh-midnight mb-1">
                          Pièce Jointe / Cahier des charges (Optionnel)
                        </label>
                        <div className="flex items-center gap-3">
                          <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-abh-border bg-abh-pearl/40 px-4 py-2 text-xs text-abh-slate hover:border-abh-amber transition-colors">
                            <FileUp className="h-4 w-4 text-abh-amber" />
                            <span>{file ? file.name : 'Choisir un fichier'}</span>
                            <input
                              type="file"
                              className="hidden"
                              accept=".pdf,.doc,.docx,.jpg,.png"
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  setFile(e.target.files[0]);
                                }
                              }}
                            />
                          </label>
                          {file && (
                            <button
                              type="button"
                              onClick={() => setFile(null)}
                              className="text-xs text-red-500 hover:underline"
                            >
                              Retirer
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-abh-sapphire to-abh-midnight py-3 px-6 text-xs sm:text-sm font-semibold text-white shadow-md hover:from-abh-midnight hover:to-abh-sapphire transition-all disabled:opacity-50"
                        >
                          {loading ? (
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          ) : (
                            <>
                              <Send className="h-4 w-4 text-abh-amber" />
                              <span>Envoyer la Demande Officielle</span>
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
