'use client';

import React, { useState, useEffect } from 'react';
import {
  Inbox,
  Trash2,
  CheckCircle,
  Clock,
  RotateCcw,
  Mail,
  Building2,
  Globe2,
  FileText,
  Phone,
  ExternalLink,
} from 'lucide-react';
import { ContactMessage } from '@/lib/types';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [adminNotes, setAdminNotes] = useState('');

  const fetchMessages = () => {
    setLoading(true);
    fetch(`/api/admin/messages?status=${statusFilter}`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setMessages(data);
          if (selectedMessage) {
            const updated = data.find((m) => m.id === selectedMessage.id);
            if (updated) setSelectedMessage(updated);
          }
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMessages();
  }, [statusFilter]);

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch('/api/admin/messages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      fetchMessages();
    } catch (err) {
      console.error(err);
    }
  };

  const saveNotes = async (id: string) => {
    try {
      await fetch('/api/admin/messages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, admin_notes: adminNotes }),
      });
      alert('Note enregistrée !');
      fetchMessages();
    } catch (err) {
      console.error(err);
    }
  };

  const deletePermanently = async (id: string) => {
    if (!confirm('Supprimer définitivement ce message ?')) return;
    try {
      await fetch(`/api/admin/messages?id=${id}&permanent=true`, {
        method: 'DELETE',
      });
      setSelectedMessage(null);
      fetchMessages();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-abh-sapphire">
            Boîte de Réception des Devis (RFQ)
          </h1>
          <p className="text-xs text-abh-slate mt-0.5">
            Suivi des demandes commerciales internationales et gestion de la corbeille sécurisée (auto-purge 7 jours).
          </p>
        </div>

        {/* Status Filter buttons */}
        <div className="flex flex-wrap items-center gap-1.5 bg-white p-1 rounded-xl border border-abh-border text-xs">
          {[
            { id: 'all', label: 'Toutes' },
            { id: 'unread', label: 'Non lues' },
            { id: 'contacted', label: 'Contactées' },
            { id: 'archived', label: 'Archivées' },
            { id: 'trash', label: 'Corbeille (7j)' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setStatusFilter(tab.id);
                setSelectedMessage(null);
              }}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                statusFilter === tab.id
                  ? 'bg-abh-sapphire text-white'
                  : 'text-abh-slate hover:text-abh-sapphire'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-5 rounded-2xl bg-white border border-abh-border shadow-xs overflow-hidden">
          <div className="p-4 bg-abh-pearl/40 border-b border-abh-border text-xs font-bold text-abh-sapphire flex justify-between items-center">
            <span>Demandes ({messages.length})</span>
            <span className="text-[10px] text-abh-slate">Sélectionnez pour ouvrir</span>
          </div>

          {loading ? (
            <div className="p-8 text-center text-xs text-abh-slate">Chargement des messages...</div>
          ) : messages.length === 0 ? (
            <div className="p-8 text-center text-xs text-abh-slate">Aucune demande dans cette vue.</div>
          ) : (
            <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
              {messages.map((msg) => {
                const isSelected = selectedMessage?.id === msg.id;
                return (
                  <div
                    key={msg.id}
                    onClick={() => {
                      setSelectedMessage(msg);
                      setAdminNotes(msg.admin_notes || '');
                      if (msg.status === 'unread') {
                        updateStatus(msg.id, 'read');
                      }
                    }}
                    className={`p-4 cursor-pointer transition-colors text-xs space-y-1 ${
                      isSelected
                        ? 'bg-abh-sand/30 border-l-4 border-abh-amber'
                        : msg.status === 'unread'
                        ? 'bg-amber-50/40 hover:bg-amber-50/70 font-semibold'
                        : 'hover:bg-abh-pearl/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-abh-midnight">{msg.company_name}</span>
                      <span className="text-[10px] text-gray-400">
                        {new Date(msg.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-[11px] text-abh-slate flex items-center gap-1.5">
                      <span>{msg.full_name}</span>
                      <span>•</span>
                      <span>{msg.country}</span>
                    </div>
                    <div className="text-[11px] text-abh-copper font-medium truncate">
                      Intérêt : {msg.product_interest}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Message Details */}
        <div className="lg:col-span-7 rounded-2xl bg-white border border-abh-border shadow-xs p-6">
          {selectedMessage ? (
            <div className="space-y-6 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
                <div>
                  <h3 className="text-lg font-heading font-bold text-abh-sapphire">
                    {selectedMessage.company_name}
                  </h3>
                  <p className="text-xs text-abh-slate">
                    Contact : {selectedMessage.full_name} ({selectedMessage.country})
                  </p>
                </div>

                {/* Status selector */}
                <div className="flex items-center gap-2">
                  <select
                    value={selectedMessage.status}
                    onChange={(e) => updateStatus(selectedMessage.id, e.target.value)}
                    className="rounded-lg border border-abh-border px-3 py-1.5 text-xs font-semibold focus:outline-none focus:border-abh-amber bg-abh-pearl/30"
                  >
                    <option value="unread">Non lu</option>
                    <option value="read">Lu</option>
                    <option value="contacted">Contacté</option>
                    <option value="archived">Archivé</option>
                    <option value="trash">Corbeille</option>
                  </select>

                  {selectedMessage.status === 'trash' && (
                    <button
                      onClick={() => deletePermanently(selectedMessage.id)}
                      className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                      title="Supprimer définitivement"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Coordinates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-abh-pearl/30 border border-abh-border/40">
                <div>
                  <span className="text-[10px] text-gray-400 block">Email :</span>
                  <a href={`mailto:${selectedMessage.email}`} className="font-semibold text-abh-sapphire hover:underline">
                    {selectedMessage.email}
                  </a>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 block">Téléphone :</span>
                  <a href={`tel:${selectedMessage.phone}`} className="font-semibold text-abh-sapphire hover:underline">
                    {selectedMessage.phone || 'Non renseigné'}
                  </a>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 block">Produit :</span>
                  <span className="font-semibold text-abh-midnight">{selectedMessage.product_interest}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 block">Volume Demandé :</span>
                  <span className="font-semibold text-abh-midnight">{selectedMessage.quantity || 'Non précisé'}</span>
                </div>
              </div>

              {/* Message text */}
              <div>
                <span className="font-bold text-abh-sapphire block mb-2">Message & Spécifications du Client :</span>
                <div className="p-4 rounded-xl bg-abh-pearl/20 border border-abh-border/60 text-abh-slate leading-relaxed whitespace-pre-line">
                  {selectedMessage.message}
                </div>
              </div>

              {/* Attachment if any */}
              {selectedMessage.file_attachment && (
                <div>
                  <span className="font-bold text-abh-sapphire block mb-1">Pièce Jointe :</span>
                  <a
                    href={selectedMessage.file_attachment}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-abh-amber/40 bg-abh-sand/20 px-3 py-1.5 text-xs font-semibold text-abh-amber hover:bg-abh-amber hover:text-white transition-colors"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span>Consulter le document joint</span>
                  </a>
                </div>
              )}

              {/* Internal notes */}
              <div className="pt-4 border-t border-gray-100 space-y-2">
                <span className="font-bold text-abh-sapphire block">Notes Internes de Suivi Commercial :</span>
                <textarea
                  rows={3}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Ex : Cotation FOB transmise le 21/10. En attente confirmation bancaire..."
                  className="w-full rounded-xl border border-abh-border p-3 focus:outline-none focus:border-abh-amber"
                />
                <button
                  type="button"
                  onClick={() => saveNotes(selectedMessage.id)}
                  className="rounded-xl bg-abh-sapphire px-4 py-2 text-white font-semibold hover:bg-abh-midnight transition-colors"
                >
                  Enregistrer la Note
                </button>
              </div>
            </div>
          ) : (
            <div className="py-20 text-center text-xs text-abh-slate">
              Sélectionnez une demande dans la liste pour consulter les détails complets.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
