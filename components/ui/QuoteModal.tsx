'use client';

import React, { useState } from 'react';
import { X, Send, CheckCircle2, AlertCircle, FileUp, Sparkles, Building2, Mail, Phone, Globe2 } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/context';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultProduct?: string;
}

export const COUNTRIES_LIST = [
  { code: 'TN', name: 'Tunisie (+216)', dial: '+216', flag: 'tn' },
  { code: 'FR', name: 'France (+33)', dial: '+33', flag: 'fr' },
  { code: 'IT', name: 'Italie (+39)', dial: '+39', flag: 'it' },
  { code: 'ES', name: 'Espagne (+34)', dial: '+34', flag: 'es' },
  { code: 'US', name: 'États-Unis (+1)', dial: '+1', flag: 'us' },
  { code: 'DE', name: 'Allemagne (+49)', dial: '+49', flag: 'de' },
  { code: 'GB', name: 'Royaume-Uni (+44)', dial: '+44', flag: 'gb' },
  { code: 'CA', name: 'Canada (+1)', dial: '+1', flag: 'ca' },
  { code: 'SA', name: 'Arabie Saoudite (+966)', dial: '+966', flag: 'sa' },
  { code: 'AE', name: 'Émirats Arabes Unis (+971)', dial: '+971', flag: 'ae' },
  { code: 'QA', name: 'Qatar (+974)', dial: '+974', flag: 'qa' },
  { code: 'KW', name: 'Koweït (+965)', dial: '+965', flag: 'kw' },
  { code: 'OM', name: 'Oman (+968)', dial: '+968', flag: 'om' },
  { code: 'JP', name: 'Japon (+81)', dial: '+81', flag: 'jp' },
  { code: 'CN', name: 'Chine (+86)', dial: '+86', flag: 'cn' },
  { code: 'KR', name: 'Corée du Sud (+82)', dial: '+82', flag: 'kr' },
  { code: 'AU', name: 'Australie (+61)', dial: '+61', flag: 'au' },
  { code: 'BR', name: 'Brésil (+55)', dial: '+55', flag: 'br' },
  { code: 'DZ', name: 'Algérie (+213)', dial: '+213', flag: 'dz' },
  { code: 'MA', name: 'Maroc (+212)', dial: '+212', flag: 'ma' },
  { code: 'LY', name: 'Libye (+218)', dial: '+218', flag: 'ly' },
  { code: 'EG', name: 'Égypte (+20)', dial: '+20', flag: 'eg' },
  { code: 'CH', name: 'Suisse (+41)', dial: '+41', flag: 'ch' },
  { code: 'BE', name: 'Belgique (+32)', dial: '+32', flag: 'be' },
  { code: 'NL', name: 'Pays-Bas (+31)', dial: '+31', flag: 'nl' },
  { code: 'SE', name: 'Suède (+46)', dial: '+46', flag: 'se' },
  { code: 'NO', name: 'Norvège (+47)', dial: '+47', flag: 'no' },
  { code: 'TR', name: 'Turquie (+90)', dial: '+90', flag: 'tr' },
  { code: 'IN', name: 'Inde (+91)', dial: '+91', flag: 'in' },
  { code: 'ZA', name: 'Afrique du Sud (+27)', dial: '+27', flag: 'za' },
  { code: 'SG', name: 'Singapour (+65)', dial: '+65', flag: 'sg' },
  { code: 'MY', name: 'Malaisie (+60)', dial: '+60', flag: 'my' },
];

export function QuoteModal({ isOpen, onClose, defaultProduct }: QuoteModalProps) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    full_name: '',
    company_name: '',
    country: 'Tunisie (+216)',
    email: '',
    phone: '',
    product_interest: defaultProduct || "Huile d'Olive Vierge Extra",
    quantity: '1 Conteneur 20ft (~21 Tonnes)',
    destination_country: '',
    message: '',
    privacy_consent: true,
    website_url: '', // Honeypot
  });

  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (selected.size > 15 * 1024 * 1024) {
        setError('Le fichier sélectionné est trop volumineux (maximum 15 Mo).');
        return;
      }
      setFile(selected);
      setError(null);
      if (selected.type.startsWith('image/')) {
        setFilePreview(URL.createObjectURL(selected));
      } else {
        setFilePreview(null);
      }
    }
  };

  const removeFile = () => {
    setFile(null);
    if (filePreview) {
      URL.revokeObjectURL(filePreview);
      setFilePreview(null);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Spam honeypot
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
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: uploadData,
        });
        if (!uploadRes.ok) {
          const errJson = await uploadRes.json().catch(() => ({}));
          throw new Error(errJson.error || 'Erreur lors du téléversement de la pièce jointe.');
        }
        const resJson = await uploadRes.json();
        attachmentUrl = resJson.url || '';
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
        throw new Error(errJson.error || 'Erreur lors de la transmission');
      }

      setSuccess(true);
      removeFile();
    } catch (err: any) {
      setError(err.message || 'Impossible d envoyer la demande. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-abh-midnight/70 backdrop-blur-sm animate-fade-in-up">
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl border border-abh-border p-4 sm:p-8"
        role="dialog"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 sm:right-5 sm:top-5 rounded-full p-2 text-gray-400 hover:bg-abh-pearl hover:text-abh-sapphire transition-colors"
          aria-label="Fermer"
        >
          <X className="h-5 w-5" />
        </button>

        {success ? (
          <div className="py-12 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mb-4 ring-8 ring-emerald-50/50">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="text-2xl font-heading font-bold text-abh-sapphire mb-2">
              Demande Transmise avec Succès
            </h3>
            <p className="text-sm text-abh-slate max-w-md mx-auto mb-6">
              Notre département commercial B2B étudie votre cahier des charges et vous adressera une cotation Incoterms FOB/CIF dans les plus brefs délais.
            </p>
            <button
              onClick={() => {
                setSuccess(false);
                onClose();
              }}
              className="rounded-xl bg-abh-sapphire px-6 py-2.5 text-sm font-semibold text-white hover:bg-abh-midnight transition-colors"
            >
              Fermer la fenêtre
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-abh-sand/50 px-3 py-1 text-xs font-semibold text-abh-sapphire mb-2">
                <Sparkles className="h-3.5 w-3.5 text-abh-amber" />
                <span>Service Export Mondial ABH</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-heading font-bold text-abh-sapphire">
                Demande de Cotation & Échantillons (RFQ)
              </h2>
              <p className="text-xs sm:text-sm text-abh-slate mt-1">
                Approvisionnement en vrac : Flexitanks 24 000L, Cuves IBC 1 000L, Fûts 208L.
              </p>
            </div>

            {error && (
              <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs text-red-700 border border-red-200">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Honeypot hidden */}
              <input
                type="text"
                name="website_url"
                value={formData.website_url}
                onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
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
                    className="w-full rounded-xl border border-abh-border bg-abh-pearl/40 px-3.5 py-2.5 text-xs sm:text-sm focus:border-abh-amber focus:bg-white focus:outline-none"
                    placeholder="ex. Jean Dupont"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-abh-midnight mb-1">
                    Raison Sociale / Société *
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={formData.company_name}
                      onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                      className="w-full rounded-xl border border-abh-border bg-abh-pearl/40 pl-9 pr-3.5 py-2.5 text-xs sm:text-sm focus:border-abh-amber focus:bg-white focus:outline-none"
                      placeholder="ex. Mediterra Foods Ltd"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-abh-midnight mb-1">
                    Email Professionnel *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full rounded-xl border border-abh-border bg-abh-pearl/40 pl-9 pr-3.5 py-2.5 text-xs sm:text-sm focus:border-abh-amber focus:bg-white focus:outline-none"
                      placeholder="contact@entreprise.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-abh-midnight mb-1">
                    Téléphone / WhatsApp
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full rounded-xl border border-abh-border bg-abh-pearl/40 pl-9 pr-3.5 py-2.5 text-xs sm:text-sm focus:border-abh-amber focus:bg-white focus:outline-none"
                      placeholder="+33 6 12 34 56 78"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-abh-midnight mb-1">
                    Pays du Siège Social *
                  </label>
                  <div className="relative">
                    <Globe2 className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                    <select
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full rounded-xl border border-abh-border bg-abh-pearl/40 pl-9 pr-3.5 py-2.5 text-xs sm:text-sm focus:border-abh-amber focus:bg-white focus:outline-none"
                    >
                      {COUNTRIES_LIST.map((c) => (
                        <option key={c.code} value={`${c.name}`}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-abh-midnight mb-1">
                    Port / Pays de Destination
                  </label>
                  <input
                    type="text"
                    value={formData.destination_country}
                    onChange={(e) => setFormData({ ...formData, destination_country: e.target.value })}
                    className="w-full rounded-xl border border-abh-border bg-abh-pearl/40 px-3.5 py-2.5 text-xs sm:text-sm focus:border-abh-amber focus:bg-white focus:outline-none"
                    placeholder="ex. Port de Marseille (FOB ou CIF)"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-abh-midnight mb-1">
                    Produit Recherché *
                  </label>
                  <select
                    value={formData.product_interest}
                    onChange={(e) => setFormData({ ...formData, product_interest: e.target.value })}
                    className="w-full rounded-xl border border-abh-border bg-abh-pearl/40 px-3.5 py-2.5 text-xs sm:text-sm focus:border-abh-amber focus:bg-white focus:outline-none"
                  >
                    <option value="Huile d'Olive Vierge Extra">Huile d Olive Vierge Extra (≤ 0.8%)</option>
                    <option value="Huile d'Olive Biologique Certifiée">Huile d Olive Biologique Certifiée (≤ 0.5%)</option>
                    <option value="Huile d'Olive Raffinée">Huile d Olive Raffinée (≤ 0.3%)</option>
                    <option value="Huile de Grignons d'Olive">Huile de Grignons d Olive (≤ 1.0%)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-abh-midnight mb-1">
                    Volume Estimé / Conditionnement
                  </label>
                  <input
                    type="text"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="w-full rounded-xl border border-abh-border bg-abh-pearl/40 px-3.5 py-2.5 text-xs sm:text-sm focus:border-abh-amber focus:bg-white focus:outline-none"
                    placeholder="ex. 2 Conteneurs Flexitank (42 Tonnes)"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-abh-midnight mb-1">
                  Spécifications Techniques & Remarques *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full rounded-xl border border-abh-border bg-abh-pearl/40 px-3.5 py-2.5 text-xs sm:text-sm focus:border-abh-amber focus:bg-white focus:outline-none"
                  placeholder="Précisez votre incoterm souhaité (FOB, CIF, CFR), vos exigences de certification ou vos analyses attendues..."
                />
              </div>

              {/* Optional File Attachment */}
              <div>
                <label className="block text-xs font-medium text-abh-midnight mb-1">
                  Pièce Jointe / Cahier des charges / Photo (Optionnel — Image, PDF, DOC ≤ 15Mo)
                </label>

                {!file ? (
                  <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-abh-border bg-abh-pearl/30 p-3 text-xs text-abh-slate hover:bg-abh-sand/20 hover:border-abh-amber transition-colors">
                    <FileUp className="h-4 w-4 text-abh-amber" />
                    <span>Cliquez pour joindre une photo ou un document</span>
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp,.svg"
                      onChange={handleFileChange}
                    />
                  </label>
                ) : (
                  <div className="flex items-center justify-between rounded-xl border border-abh-amber/40 bg-abh-sand/15 p-2.5">
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      {filePreview ? (
                        <img
                          src={filePreview}
                          alt="Aperçu"
                          className="h-10 w-10 rounded-lg object-cover border border-abh-border shadow-xs shrink-0"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-abh-sapphire/10 text-abh-sapphire shrink-0">
                          <FileUp className="h-5 w-5 text-abh-amber" />
                        </div>
                      )}
                      <div className="truncate">
                        <p className="text-xs font-semibold text-abh-sapphire truncate">{file.name}</p>
                        <p className="text-[10px] text-gray-500">{(file.size / (1024 * 1024)).toFixed(2)} Mo</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeFile}
                      className="rounded-lg px-2.5 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors shrink-0"
                    >
                      Retirer
                    </button>
                  </div>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-abh-sapphire to-abh-midnight py-3 px-6 text-sm font-semibold text-white shadow-lg shadow-abh-sapphire/20 hover:from-abh-midnight hover:to-abh-sapphire hover:shadow-xl transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <>
                      <Send className="h-4 w-4 text-abh-amber" />
                      <span>Transmettre la Demande de Cotation</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default QuoteModal;
