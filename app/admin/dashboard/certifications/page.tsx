'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Certification } from '@/lib/types';
import { Plus, Edit2, Trash2, Award, X } from 'lucide-react';
import { ImageUploader } from '@/components/ui/ImageUploader';

export default function AdminCertificationsPage() {
  const [certs, setCerts] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<Certification | null>(null);

  const [form, setForm] = useState({
    slug: '',
    logo: '/images/certs/iso22000.svg',
    name: '',
    issuer: '',
    description: '',
  });

  const fetchCerts = () => {
    setLoading(true);
    fetch('/api/admin/certifications')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setCerts(data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCerts();
  }, []);

  const openNew = () => {
    setEditingCert(null);
    setForm({
      slug: '',
      logo: '/images/certs/iso22000.svg',
      name: '',
      issuer: '',
      description: '',
    });
    setModalOpen(true);
  };

  const openEdit = (c: Certification) => {
    setEditingCert(c);
    const trans = c.translations?.fr || Object.values(c.translations || {})[0] || {};
    setForm({
      slug: c.slug,
      logo: c.logo,
      name: trans.name || '',
      issuer: trans.issuer || '',
      description: trans.description || '',
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        slug: form.slug || form.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        logo: form.logo,
        translations: {
          fr: {
            name: form.name,
            issuer: form.issuer,
            description: form.description,
          },
        },
      };

      const method = editingCert ? 'PUT' : 'POST';
      const body = editingCert ? { id: editingCert.id, ...payload } : payload;

      const res = await fetch('/api/admin/certifications', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setModalOpen(false);
        fetchCerts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cette certification ?')) return;
    try {
      await fetch(`/api/admin/certifications?id=${id}`, { method: 'DELETE' });
      fetchCerts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-abh-sapphire">
            Gestionnaire des Certifications & Normes
          </h1>
          <p className="text-xs text-abh-slate mt-0.5">
            Ajoutez, mettez à jour ou modifiez les accréditations qualité affichées aux clients B2B.
          </p>
        </div>

        <button
          onClick={openNew}
          className="inline-flex items-center gap-1.5 rounded-xl bg-abh-sapphire px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-abh-midnight transition-colors"
        >
          <Plus className="h-4 w-4 text-abh-amber" />
          <span>Ajouter une Certification</span>
        </button>
      </div>

      {loading ? (
        <div className="p-8 text-center text-xs text-abh-slate">Chargement...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {certs.map((c) => {
            const trans = c.translations?.fr || Object.values(c.translations || {})[0] || {};
            return (
              <div
                key={c.id}
                className="rounded-2xl bg-white border border-abh-border p-5 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="relative h-12 w-16">
                      <Image src={c.logo} alt={trans.name} fill className="object-contain" />
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Actif
                    </span>
                  </div>

                  <h3 className="font-heading font-bold text-base text-abh-sapphire mb-1">
                    {trans.name}
                  </h3>
                  <p className="text-[11px] font-semibold text-abh-copper mb-2">
                    {trans.issuer}
                  </p>
                  <p className="text-xs text-abh-slate leading-relaxed">
                    {trans.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end gap-2">
                  <button
                    onClick={() => openEdit(c)}
                    className="p-1 rounded-lg text-abh-sapphire hover:bg-abh-pearl"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="p-1 rounded-lg text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-abh-midnight/70 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-abh-border text-xs">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-abh-sapphire"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-lg font-heading font-bold text-abh-sapphire mb-4">
              {editingCert ? 'Modifier la Certification' : 'Nouvelle Certification'}
            </h3>
            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block font-medium mb-1">Nom du Label *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-xl border border-abh-border p-2 focus:outline-none focus:border-abh-amber"
                  placeholder="ex. ISO 22000:2018"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Organisme Émetteur *</label>
                <input
                  type="text"
                  required
                  value={form.issuer}
                  onChange={(e) => setForm({ ...form, issuer: e.target.value })}
                  className="w-full rounded-xl border border-abh-border p-2 focus:outline-none focus:border-abh-amber"
                  placeholder="ex. AFAQ / AFNOR Certification"
                />
              </div>

              <ImageUploader
                label="Logo SVG ou Image du Label"
                defaultImage={form.logo}
                onUploadSuccess={(url) => setForm({ ...form, logo: url })}
              />

              <div>
                <label className="block font-medium mb-1">Description & Portée de l Audit</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full rounded-xl border border-abh-border p-2 focus:outline-none focus:border-abh-amber"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full rounded-xl bg-abh-sapphire py-2.5 text-white font-semibold hover:bg-abh-midnight transition-colors"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
