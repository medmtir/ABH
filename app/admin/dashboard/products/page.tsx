'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Product } from '@/lib/types';
import { ImageUploader } from '@/components/ui/ImageUploader';
import { AutoTranslateButton } from '@/components/ui/AutoTranslateButton';
import { Plus, Edit2, Trash2, CheckCircle2, XCircle, Boxes, X } from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [form, setForm] = useState({
    slug: '',
    acidity_max: 0.8,
    hero_image: '/images/products/extra-vierge.jpg',
    specs: {
      acidity: '≤ 0.8%',
      variety: 'Chemlali',
      extraction: 'Extraction à froid',
      origin: 'Bouhajla, Kairouan',
      packaging: 'Flexitank 24 000L',
      moq: '1 Conteneur 20ft',
    },
    translations: {
      fr: { title: '', subtitle: '', short_description: '', description: '' },
      en: { title: '', subtitle: '', short_description: '', description: '' },
      ar: { title: '', subtitle: '', short_description: '', description: '' },
    },
  });

  const fetchProducts = () => {
    setLoading(true);
    fetch('/api/admin/products')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setProducts(data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openEdit = (p: Product) => {
    setEditingProduct(p);
    setForm({
      slug: p.slug,
      acidity_max: p.acidity_max,
      hero_image: p.hero_image,
      specs: { ...p.specs },
      translations: {
        fr: { ...(p.translations?.fr || { title: '', subtitle: '', short_description: '', description: '' }) },
        en: { ...(p.translations?.en || { title: '', subtitle: '', short_description: '', description: '' }) },
        ar: { ...(p.translations?.ar || { title: '', subtitle: '', short_description: '', description: '' }) },
      },
    });
    setModalOpen(true);
  };

  const openNew = () => {
    setEditingProduct(null);
    setForm({
      slug: '',
      acidity_max: 0.8,
      hero_image: '/images/products/extra-vierge.jpg',
      specs: {
        acidity: '≤ 0.8%',
        variety: 'Chemlali',
        extraction: 'Extraction à froid',
        origin: 'Bouhajla, Kairouan',
        packaging: 'Flexitank 24 000L',
        moq: '1 Conteneur 20ft',
      },
      translations: {
        fr: { title: '', subtitle: '', short_description: '', description: '' },
        en: { title: '', subtitle: '', short_description: '', description: '' },
        ar: { title: '', subtitle: '', short_description: '', description: '' },
      },
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingProduct ? 'PUT' : 'POST';
      const body = editingProduct ? { id: editingProduct.id, ...form } : form;

      const res = await fetch('/api/admin/products', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setModalOpen(false);
        fetchProducts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce produit du catalogue ?')) return;
    try {
      await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' });
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-abh-sapphire">
            Catalogue Produits & Fiches Physico-Chimiques
          </h1>
          <p className="text-xs text-abh-slate mt-0.5">
            Gérez les spécifications techniques, variétés d olives, acidités maximales et traductions.
          </p>
        </div>

        <button
          onClick={openNew}
          className="inline-flex items-center gap-1.5 rounded-xl bg-abh-sapphire px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-abh-midnight transition-colors"
        >
          <Plus className="h-4 w-4 text-abh-amber" />
          <span>Ajouter un Produit</span>
        </button>
      </div>

      {/* Grid of products */}
      {loading ? (
        <div className="p-8 text-center text-xs text-abh-slate">Chargement des produits...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => {
            const trans = p.translations?.fr || Object.values(p.translations || {})[0] || {};
            return (
              <div
                key={p.id}
                className="rounded-2xl bg-white border border-abh-border shadow-xs overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-video w-full bg-abh-pearl">
                    <Image src={p.hero_image} alt={trans.title} fill className="object-cover" />
                    <div className="absolute top-3 left-3 rounded-full bg-abh-midnight/80 px-2.5 py-0.5 text-[11px] font-bold text-abh-amber">
                      Acidité ≤ {p.acidity_max}%
                    </div>
                  </div>

                  <div className="p-5 text-xs space-y-2">
                    <h3 className="text-base font-heading font-bold text-abh-sapphire">
                      {trans.title}
                    </h3>
                    <p className="text-[11px] text-abh-copper font-medium">{trans.subtitle}</p>
                    <p className="text-abh-slate line-clamp-2 leading-relaxed">
                      {trans.short_description || trans.description}
                    </p>
                    <div className="pt-2 text-[11px] text-gray-500 border-t border-gray-100 flex justify-between">
                      <span>Origine: {p.specs?.origin}</span>
                      <span>MOQ: {p.specs?.moq}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0 border-t border-gray-100 flex items-center justify-end gap-2">
                  <button
                    onClick={() => openEdit(p)}
                    className="p-1.5 rounded-lg border border-abh-border text-abh-sapphire hover:bg-abh-pearl"
                    title="Modifier"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                    title="Supprimer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Edit / Create */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-abh-midnight/70 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl border border-abh-border text-xs">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-abh-sapphire"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-lg font-heading font-bold text-abh-sapphire mb-4">
              {editingProduct ? 'Modifier le Produit' : 'Ajouter un Nouveau Produit'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-1">Slug URL (ex. huile-olive-extra) *</label>
                  <input
                    type="text"
                    required
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    className="w-full rounded-xl border border-abh-border p-2 focus:outline-none focus:border-abh-amber"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Acidité Maximale (%) *</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={form.acidity_max}
                    onChange={(e) => setForm({ ...form, acidity_max: Number(e.target.value) })}
                    className="w-full rounded-xl border border-abh-border p-2 focus:outline-none focus:border-abh-amber"
                  />
                </div>
              </div>

              {/* Image upload */}
              <ImageUploader
                label="Photo Principale du Produit"
                defaultImage={form.hero_image}
                onUploadSuccess={(url) => setForm({ ...form, hero_image: url })}
              />

              {/* Specs */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium mb-1">Variété</label>
                  <input
                    type="text"
                    value={form.specs.variety}
                    onChange={(e) =>
                      setForm({ ...form, specs: { ...form.specs, variety: e.target.value } })
                    }
                    className="w-full rounded-xl border border-abh-border p-2"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Extraction</label>
                  <input
                    type="text"
                    value={form.specs.extraction}
                    onChange={(e) =>
                      setForm({ ...form, specs: { ...form.specs, extraction: e.target.value } })
                    }
                    className="w-full rounded-xl border border-abh-border p-2"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">MOQ</label>
                  <input
                    type="text"
                    value={form.specs.moq}
                    onChange={(e) =>
                      setForm({ ...form, specs: { ...form.specs, moq: e.target.value } })
                    }
                    className="w-full rounded-xl border border-abh-border p-2"
                  />
                </div>
              </div>

              {/* French translation */}
              <div className="p-4 rounded-xl bg-abh-pearl/40 border border-abh-border/60 space-y-3">
                <div className="flex items-center justify-between font-bold text-abh-sapphire">
                  <span>Version Française (FR - Référence)</span>
                  <div className="flex gap-2">
                    <AutoTranslateButton
                      sourceText={form.translations.fr.title}
                      targetLang="en"
                      onTranslated={(txt) =>
                        setForm({
                          ...form,
                          translations: {
                            ...form.translations,
                            en: { ...form.translations.en, title: txt },
                          },
                        })
                      }
                    />
                    <AutoTranslateButton
                      sourceText={form.translations.fr.title}
                      targetLang="ar"
                      onTranslated={(txt) =>
                        setForm({
                          ...form,
                          translations: {
                            ...form.translations,
                            ar: { ...form.translations.ar, title: txt },
                          },
                        })
                      }
                    />
                  </div>
                </div>

                <input
                  type="text"
                  placeholder="Titre du produit (FR)"
                  required
                  value={form.translations.fr.title}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      translations: {
                        ...form.translations,
                        fr: { ...form.translations.fr, title: e.target.value },
                      },
                    })
                  }
                  className="w-full rounded-xl border border-abh-border p-2"
                />

                <input
                  type="text"
                  placeholder="Sous-titre (FR)"
                  value={form.translations.fr.subtitle}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      translations: {
                        ...form.translations,
                        fr: { ...form.translations.fr, subtitle: e.target.value },
                      },
                    })
                  }
                  className="w-full rounded-xl border border-abh-border p-2"
                />

                <textarea
                  rows={3}
                  placeholder="Description détaillée (FR)"
                  value={form.translations.fr.description}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      translations: {
                        ...form.translations,
                        fr: { ...form.translations.fr, description: e.target.value },
                      },
                    })
                  }
                  className="w-full rounded-xl border border-abh-border p-2"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full rounded-xl bg-abh-sapphire py-2.5 text-white font-semibold hover:bg-abh-midnight transition-colors"
                >
                  Enregistrer les Modifications
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
