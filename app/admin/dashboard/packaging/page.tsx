'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Packaging } from '@/lib/types';
import { Plus, Edit2, Trash2, Package, X } from 'lucide-react';
import { ImageUploader } from '@/components/ui/ImageUploader';

export default function AdminPackagingPage() {
  const [packagings, setPackagings] = useState<Packaging[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPack, setEditingPack] = useState<Packaging | null>(null);

  const [form, setForm] = useState({
    capacity: '',
    title: '',
    image_url: '/images/packaging/ibc-container.jpg',
    badge: '',
    description: '',
    sort_order: 1,
    is_active: true,
  });

  const fetchPackagings = () => {
    setLoading(true);
    fetch('/api/admin/packaging')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setPackagings(data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPackagings();
  }, []);

  const openNew = () => {
    setEditingPack(null);
    setForm({
      capacity: '',
      title: '',
      image_url: '/images/packaging/ibc-container.jpg',
      badge: '',
      description: '',
      sort_order: packagings.length + 1,
      is_active: true,
    });
    setModalOpen(true);
  };

  const openEdit = (p: Packaging) => {
    setEditingPack(p);
    setForm({
      capacity: p.capacity,
      title: p.title,
      image_url: p.image_url,
      badge: p.badge,
      description: p.description,
      sort_order: p.sort_order,
      is_active: p.is_active,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingPack ? 'PUT' : 'POST';
      const body = editingPack ? { id: editingPack.id, ...form } : form;

      const res = await fetch('/api/admin/packaging', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setModalOpen(false);
        fetchPackagings();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce format de conditionnement ?')) return;
    try {
      await fetch(`/api/admin/packaging?id=${id}`, { method: 'DELETE' });
      fetchPackagings();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-abh-sapphire">
            Formats de Conditionnement Vrac
          </h1>
          <p className="text-xs text-abh-slate mt-0.5">
            Gestion des contenants maritimes : Flexitanks, IBC 1 000L, fûts acier et seaux.
          </p>
        </div>

        <button
          onClick={openNew}
          className="inline-flex items-center gap-1.5 rounded-xl bg-abh-sapphire px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-abh-midnight transition-colors"
        >
          <Plus className="h-4 w-4 text-abh-amber" />
          <span>Ajouter un Format</span>
        </button>
      </div>

      {loading ? (
        <div className="p-8 text-center text-xs text-abh-slate">Chargement...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {packagings.map((pkg) => (
            <div
              key={pkg.id}
              className="rounded-2xl bg-white border border-abh-border shadow-xs overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-video w-full bg-abh-pearl">
                  <Image src={pkg.image_url} alt={pkg.title} fill className="object-cover" />
                  {pkg.badge && (
                    <div className="absolute top-2 left-2 rounded-full bg-abh-midnight/80 px-2 py-0.5 text-[10px] font-bold text-abh-amber">
                      {pkg.badge}
                    </div>
                  )}
                </div>

                <div className="p-4 text-xs space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-abh-amber block">
                    {pkg.capacity}
                  </span>
                  <h3 className="font-heading font-bold text-base text-abh-sapphire">{pkg.title}</h3>
                  <p className="text-abh-slate line-clamp-3 text-[11px] leading-relaxed pt-1">
                    {pkg.description}
                  </p>
                </div>
              </div>

              <div className="p-3 border-t border-gray-100 flex items-center justify-between text-[11px]">
                <span className="text-gray-400">Ordre : {pkg.sort_order}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEdit(pkg)}
                    className="p-1 rounded-lg text-abh-sapphire hover:bg-abh-pearl"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(pkg.id)}
                    className="p-1 rounded-lg text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
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
              {editingPack ? 'Modifier le Format' : 'Nouveau Conditionnement'}
            </h3>
            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block font-medium mb-1">Capacité (ex. 24 000 Litres) *</label>
                <input
                  type="text"
                  required
                  value={form.capacity}
                  onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                  className="w-full rounded-xl border border-abh-border p-2 focus:outline-none focus:border-abh-amber"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Titre du Format *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full rounded-xl border border-abh-border p-2 focus:outline-none focus:border-abh-amber"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Badge (ex. Vrac Maritime)</label>
                <input
                  type="text"
                  value={form.badge}
                  onChange={(e) => setForm({ ...form, badge: e.target.value })}
                  className="w-full rounded-xl border border-abh-border p-2 focus:outline-none focus:border-abh-amber"
                />
              </div>

              <ImageUploader
                label="Photo du Contenant"
                defaultImage={form.image_url}
                onUploadSuccess={(url) => setForm({ ...form, image_url: url })}
              />

              <div>
                <label className="block font-medium mb-1">Description Technique</label>
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
