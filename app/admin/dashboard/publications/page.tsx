'use client';

import React, { useState, useEffect } from 'react';
import { Publication } from '@/lib/types';
import { Plus, Edit2, Trash2, BookOpen, X, FileText } from 'lucide-react';

export default function AdminPublicationsPage() {
  const [pubs, setPubs] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPub, setEditingPub] = useState<Publication | null>(null);

  const [form, setForm] = useState({
    title: '',
    category: 'report' as 'analysis' | 'guide' | 'report',
    date: new Date().toISOString().split('T')[0],
    file_size: '1.5 MB',
    summary: '',
    content: '',
  });

  const fetchPubs = () => {
    setLoading(true);
    fetch('/api/admin/publications')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setPubs(data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPubs();
  }, []);

  const openNew = () => {
    setEditingPub(null);
    setForm({
      title: '',
      category: 'report',
      date: new Date().toISOString().split('T')[0],
      file_size: '1.5 MB',
      summary: '',
      content: '',
    });
    setModalOpen(true);
  };

  const openEdit = (p: Publication) => {
    setEditingPub(p);
    const trans = p.translations?.fr || Object.values(p.translations || {})[0] || {};
    setForm({
      title: trans.title || '',
      category: p.category,
      date: p.date,
      file_size: p.file_size || '1.0 MB',
      summary: trans.summary || '',
      content: trans.content || '',
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        category: form.category,
        date: form.date,
        file_size: form.file_size,
        translations: {
          fr: {
            title: form.title,
            summary: form.summary,
            content: form.content,
          },
        },
      };

      const method = editingPub ? 'PUT' : 'POST';
      const body = editingPub ? { id: editingPub.id, ...payload } : payload;

      const res = await fetch('/api/admin/publications', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setModalOpen(false);
        fetchPubs();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cette publication ?')) return;
    try {
      await fetch(`/api/admin/publications?id=${id}`, { method: 'DELETE' });
      fetchPubs();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-abh-sapphire">
            Publications, Rapports de Récolte & Analyses Labo
          </h1>
          <p className="text-xs text-abh-slate mt-0.5">
            Publiez des bilans de campagne oléicole et des rapports de marché pour vos prospects B2B.
          </p>
        </div>

        <button
          onClick={openNew}
          className="inline-flex items-center gap-1.5 rounded-xl bg-abh-sapphire px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-abh-midnight transition-colors"
        >
          <Plus className="h-4 w-4 text-abh-amber" />
          <span>Rédiger une Publication</span>
        </button>
      </div>

      {loading ? (
        <div className="p-8 text-center text-xs text-abh-slate">Chargement...</div>
      ) : pubs.length === 0 ? (
        <div className="p-8 text-center text-xs text-abh-slate bg-white rounded-2xl border border-abh-border">
          Aucun article ou rapport pour le moment.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pubs.map((p) => {
            const trans = p.translations?.fr || Object.values(p.translations || {})[0] || {};
            return (
              <div
                key={p.id}
                className="rounded-2xl bg-white border border-abh-border p-6 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] text-abh-slate mb-2">
                    <span className="rounded-full bg-abh-sand/40 px-2.5 py-0.5 text-abh-sapphire font-semibold">
                      {p.category.toUpperCase()}
                    </span>
                    <span>{new Date(p.date).toLocaleDateString()}</span>
                  </div>

                  <h3 className="font-heading font-bold text-lg text-abh-sapphire mb-2">
                    {trans.title}
                  </h3>
                  <p className="text-xs text-abh-slate leading-relaxed mb-4">
                    {trans.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[10px] text-gray-400">PDF : {p.file_size}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEdit(p)}
                      className="p-1 rounded-lg text-abh-sapphire hover:bg-abh-pearl"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="p-1 rounded-lg text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-abh-midnight/70 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-abh-border text-xs">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-abh-sapphire"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-lg font-heading font-bold text-abh-sapphire mb-4">
              {editingPub ? 'Modifier la Publication' : 'Nouvelle Publication'}
            </h3>
            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block font-medium mb-1">Titre de l Article ou du Rapport *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full rounded-xl border border-abh-border p-2 focus:outline-none focus:border-abh-amber"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1">Catégorie</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value as any })}
                    className="w-full rounded-xl border border-abh-border p-2 focus:outline-none focus:border-abh-amber"
                  >
                    <option value="report">Rapport de Campagne</option>
                    <option value="analysis">Analyse Physico-Chimique</option>
                    <option value="guide">Guide Export / Logistique</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium mb-1">Date</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full rounded-xl border border-abh-border p-2 focus:outline-none focus:border-abh-amber"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium mb-1">Résumé Sommaire</label>
                <textarea
                  rows={2}
                  value={form.summary}
                  onChange={(e) => setForm({ ...form, summary: e.target.value })}
                  className="w-full rounded-xl border border-abh-border p-2 focus:outline-none focus:border-abh-amber"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Contenu Principal</label>
                <textarea
                  rows={5}
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="w-full rounded-xl border border-abh-border p-2 focus:outline-none focus:border-abh-amber"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full rounded-xl bg-abh-sapphire py-2.5 text-white font-semibold hover:bg-abh-midnight transition-colors"
                >
                  Publier l Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
