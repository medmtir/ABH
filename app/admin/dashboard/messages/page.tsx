'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  RefreshCw,
  AlertTriangle,
  Eye,
  Download,
  X,
  Image as ImageIcon,
  Check,
  Sparkles,
} from 'lucide-react';
import { ContactMessage } from '@/lib/types';

interface CountsState {
  all: number;
  unread: number;
  contacted: number;
  archived: number;
  trash: number;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [counts, setCounts] = useState<CountsState>({
    all: 0,
    unread: 0,
    contacted: 0,
    archived: 0,
    trash: 0,
  });
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [newQuoteNotice, setNewQuoteNotice] = useState<string | null>(null);

  // Modals & Popups
  const [trashModalOpen, setTrashModalOpen] = useState(false);
  const [permanentDeleteModalOpen, setPermanentDeleteModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // Toast feedback
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const prevCountRef = useRef<number>(0);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((curr) => (curr?.message === message ? null : curr));
    }, 4000);
  };

  const fetchMessages = useCallback(
    async (silent = false) => {
      if (!silent) setLoading(true);
      else setIsRefreshing(true);

      try {
        const res = await fetch(`/api/admin/messages?status=${statusFilter}`, {
          cache: 'no-store',
        });
        if (!res.ok) throw new Error('Erreur de chargement');
        const data = await res.json();

        const msgList: ContactMessage[] = Array.isArray(data)
          ? data
          : Array.isArray(data.messages)
          ? data.messages
          : [];

        // Check if new unread message arrived
        if (silent && prevCountRef.current > 0 && msgList.length > prevCountRef.current) {
          const diff = msgList.length - prevCountRef.current;
          setNewQuoteNotice(
            `${diff} nouvelle${diff > 1 ? 's' : ''} demande${diff > 1 ? 's' : ''} de cotation reçue${diff > 1 ? 's' : ''} !`
          );
        }
        prevCountRef.current = msgList.length;

        setMessages(msgList);
        if (data.counts) {
          setCounts(data.counts);
        } else {
          setCounts({
            all: msgList.filter((m) => m.status !== 'trash').length,
            unread: msgList.filter((m) => m.status === 'unread').length,
            contacted: msgList.filter((m) => m.status === 'contacted').length,
            archived: msgList.filter((m) => m.status === 'archived').length,
            trash: msgList.filter((m) => m.status === 'trash').length,
          });
        }

        // Keep selected message synchronized
        setSelectedMessage((curr) => {
          if (!curr) return null;
          const found = msgList.find((m) => m.id === curr.id);
          return found || null;
        });

        setLastUpdated(new Date());
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
        setIsRefreshing(false);
      }
    },
    [statusFilter]
  );

  // Initial load and filter change
  useEffect(() => {
    fetchMessages(false);
  }, [fetchMessages]);

  // Polling every 7 seconds for real-time live updates
  useEffect(() => {
    const interval = setInterval(() => {
      fetchMessages(true);
    }, 7000);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  // Sync admin notes when selecting message
  useEffect(() => {
    if (selectedMessage) {
      setAdminNotes(selectedMessage.admin_notes || '');
    }
  }, [selectedMessage?.id]);

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch('/api/admin/messages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        showToast(
          status === 'trash'
            ? 'Demande déplacée dans la corbeille'
            : status === 'read'
            ? 'Marquée comme lue'
            : `Statut mis à jour : ${status}`
        );
        fetchMessages(true);
      }
    } catch (err) {
      showToast('Erreur lors de la mise à jour', 'error');
    }
  };

  const handleMoveToTrash = async () => {
    if (!selectedMessage) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/messages?id=${selectedMessage.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        showToast('Demande déplacée dans la corbeille (conservée 7 jours)');
        setTrashModalOpen(false);
        setSelectedMessage(null);
        fetchMessages(false);
      } else {
        throw new Error();
      }
    } catch (err) {
      showToast('Impossible de déplacer le devis vers la corbeille', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRestore = async (id: string) => {
    setActionLoading(true);
    try {
      const res = await fetch('/api/admin/messages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'read' }),
      });
      if (res.ok) {
        showToast('Demande restaurée dans la boîte de réception');
        fetchMessages(false);
      } else {
        throw new Error();
      }
    } catch (err) {
      showToast('Erreur lors de la restauration', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeletePermanently = async () => {
    if (!selectedMessage) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/messages?id=${selectedMessage.id}&permanent=true`, {
        method: 'DELETE',
      });
      if (res.ok) {
        showToast('Demande supprimée définitivement');
        setPermanentDeleteModalOpen(false);
        setSelectedMessage(null);
        fetchMessages(false);
      } else {
        throw new Error();
      }
    } catch (err) {
      showToast('Erreur lors de la suppression définitive', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const saveNotes = async (id: string) => {
    try {
      const res = await fetch('/api/admin/messages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, admin_notes: adminNotes }),
      });
      if (res.ok) {
        showToast('Notes internes enregistrées avec succès !');
        fetchMessages(true);
      }
    } catch (err) {
      showToast('Erreur lors de l enregistrement de la note', 'error');
    }
  };

  const isImageFile = (url?: string) => {
    if (!url) return false;
    const cleanUrl = url.toLowerCase().split('?')[0];
    return (
      cleanUrl.endsWith('.jpg') ||
      cleanUrl.endsWith('.jpeg') ||
      cleanUrl.endsWith('.png') ||
      cleanUrl.endsWith('.webp') ||
      cleanUrl.endsWith('.svg')
    );
  };

  const isPdfFile = (url?: string) => {
    if (!url) return false;
    return url.toLowerCase().split('?')[0].endsWith('.pdf');
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-2xl px-5 py-3.5 shadow-2xl text-xs font-semibold animate-fade-in-up border ${
            toast.type === 'success'
              ? 'bg-emerald-900/90 text-white border-emerald-500/30 backdrop-blur-md'
              : toast.type === 'error'
              ? 'bg-rose-900/90 text-white border-rose-500/30 backdrop-blur-md'
              : 'bg-abh-midnight/90 text-white border-abh-amber/30 backdrop-blur-md'
          }`}
        >
          {toast.type === 'success' && <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />}
          {toast.type === 'error' && <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* New quote real-time banner */}
      {newQuoteNotice && (
        <div className="flex items-center justify-between gap-3 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-emerald-500/25 to-teal-500/15 border border-emerald-400/40 p-4 shadow-sm animate-fade-in-up">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-emerald-950">{newQuoteNotice}</p>
              <p className="text-[11px] text-emerald-800">
                La liste a été synchronisée instantanément avec la base de données.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setNewQuoteNotice(null);
              setStatusFilter('unread');
            }}
            className="rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-xs"
          >
            Voir les non lues
          </button>
        </div>
      )}

      {/* Top Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-heading font-bold text-abh-sapphire">
              Boîte de Réception des Devis (RFQ)
            </h1>
            <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Temps Réel</span>
            </span>
          </div>
          <p className="text-xs text-abh-slate mt-0.5">
            Suivi des demandes commerciales, devis B2B et gestion de la corbeille sécurisée (auto-purge 7 jours).
          </p>
        </div>

        {/* Right side controls: Refresh button & last updated */}
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-gray-400 hidden sm:inline">
            Mis à jour à {lastUpdated.toLocaleTimeString()}
          </span>
          <button
            onClick={() => fetchMessages(true)}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 rounded-xl border border-abh-border bg-white px-3 py-1.5 text-xs font-semibold text-abh-sapphire hover:bg-abh-pearl shadow-2xs transition-colors disabled:opacity-50"
            title="Actualiser la liste"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-abh-amber ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Actualiser</span>
          </button>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 bg-white p-1.5 rounded-2xl border border-abh-border shadow-2xs text-xs">
        {[
          { id: 'all', label: 'Toutes', count: counts.all },
          { id: 'unread', label: 'Non lues', count: counts.unread },
          { id: 'contacted', label: 'Contactées', count: counts.contacted },
          { id: 'archived', label: 'Archivées', count: counts.archived },
          { id: 'trash', label: 'Corbeille (7j)', count: counts.trash, isTrash: true },
        ].map((tab) => {
          const isActive = statusFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setStatusFilter(tab.id);
                setSelectedMessage(null);
              }}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl font-semibold transition-all ${
                isActive
                  ? tab.isTrash
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-abh-sapphire text-white shadow-xs'
                  : 'text-abh-slate hover:text-abh-sapphire hover:bg-abh-pearl/60'
              }`}
            >
              {tab.isTrash && <Trash2 className="h-3.5 w-3.5" />}
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  isActive
                    ? 'bg-white/25 text-white'
                    : tab.isTrash
                    ? 'bg-rose-50 text-rose-700'
                    : 'bg-gray-100 text-abh-slate'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Notice when in trash view */}
      {statusFilter === 'trash' && (
        <div className="flex items-center gap-3 rounded-2xl bg-amber-50/80 border border-amber-200/80 p-3.5 text-xs text-amber-900">
          <Clock className="h-4 w-4 text-amber-600 shrink-0" />
          <span>
            <strong>Corbeille sécurisée :</strong> Les devis placés dans la corbeille sont conservés pendant 7 jours
            avant leur purge définitive automatique. Vous pouvez les restaurer à tout moment.
          </span>
        </div>
      )}

      {/* Main 2-Column Split: Message List & Detailed Message View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Messages List */}
        <div className="lg:col-span-5 rounded-2xl bg-white border border-abh-border shadow-xs overflow-hidden flex flex-col">
          <div className="p-4 bg-abh-pearl/40 border-b border-abh-border text-xs font-bold text-abh-sapphire flex justify-between items-center">
            <span className="flex items-center gap-2">
              <Inbox className="h-4 w-4 text-abh-amber" />
              <span>
                {statusFilter === 'trash' ? 'Corbeille' : 'Demandes Reçues'} ({messages.length})
              </span>
            </span>
            <span className="text-[10px] text-abh-slate">Sélectionnez pour ouvrir</span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-xs text-abh-slate flex flex-col items-center justify-center gap-2">
              <RefreshCw className="h-5 w-5 animate-spin text-abh-amber" />
              <span>Synchronisation des devis...</span>
            </div>
          ) : messages.length === 0 ? (
            <div className="p-12 text-center text-xs text-abh-slate">
              {statusFilter === 'trash'
                ? 'La corbeille est vide.'
                : 'Aucune demande de devis dans cette catégorie.'}
            </div>
          ) : (
            <div className="divide-y divide-gray-100 max-h-[640px] overflow-y-auto">
              {messages.map((msg) => {
                const isSelected = selectedMessage?.id === msg.id;
                const hasAttachment = Boolean(msg.file_attachment);
                const isImg = isImageFile(msg.file_attachment);

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
                    className={`p-4 cursor-pointer transition-all text-xs space-y-1.5 ${
                      isSelected
                        ? 'bg-amber-50/70 border-l-4 border-abh-amber'
                        : msg.status === 'unread'
                        ? 'bg-emerald-50/30 hover:bg-emerald-50/60 font-semibold'
                        : 'hover:bg-abh-pearl/40'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 truncate">
                        {msg.status === 'unread' && (
                          <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" title="Non lu" />
                        )}
                        <span className="font-bold text-abh-midnight truncate">{msg.company_name}</span>
                      </div>
                      <span className="text-[10px] text-gray-400 shrink-0">
                        {new Date(msg.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="text-[11px] text-abh-slate flex items-center gap-1.5 truncate">
                      <span>{msg.full_name}</span>
                      <span>•</span>
                      <span>{msg.country}</span>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-0.5">
                      <span className="text-[11px] text-abh-copper font-medium truncate">
                        Intérêt : {msg.product_interest}
                      </span>

                      {/* Attachment indicator pill */}
                      {hasAttachment && (
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-bold shrink-0 ${
                            isImg
                              ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {isImg ? <ImageIcon className="h-3 w-3" /> : <FileText className="h-3 w-3" />}
                          <span>{isImg ? 'Photo' : 'Doc'}</span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Message Details */}
        <div className="lg:col-span-7 rounded-2xl bg-white border border-abh-border shadow-xs p-6">
          {selectedMessage ? (
            <div className="space-y-6 text-xs animate-fade-in-up">
              {/* Top Details Action Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-heading font-bold text-abh-sapphire">
                      {selectedMessage.company_name}
                    </h3>
                    {selectedMessage.status === 'trash' && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-800">
                        <Trash2 className="h-3 w-3" />
                        <span>Dans la corbeille</span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-abh-slate mt-0.5">
                    Contact : <strong>{selectedMessage.full_name}</strong> • Origine :{' '}
                    <strong>{selectedMessage.country}</strong>
                  </p>
                </div>

                {/* Status selector & Standalone Delete button */}
                <div className="flex items-center gap-2 shrink-0">
                  {/* Status Dropdown (only when NOT in trash) */}
                  {selectedMessage.status !== 'trash' && (
                    <select
                      value={selectedMessage.status}
                      onChange={(e) => updateStatus(selectedMessage.id, e.target.value)}
                      className="rounded-xl border border-abh-border px-3 py-2 text-xs font-semibold focus:outline-none focus:border-abh-amber bg-abh-pearl/40 text-abh-midnight"
                    >
                      <option value="unread">Non lu</option>
                      <option value="read">Lu</option>
                      <option value="contacted">Contacté</option>
                      <option value="archived">Archivé</option>
                    </select>
                  )}

                  {/* STANDALONE SUPPRIMER BUTTON (Moving to Corbeille) */}
                  {selectedMessage.status !== 'trash' ? (
                    <button
                      onClick={() => setTrashModalOpen(true)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100 hover:border-rose-300 shadow-2xs transition-colors"
                      title="Mettre ce devis à la corbeille"
                    >
                      <Trash2 className="h-4 w-4 text-rose-600" />
                      <span>Supprimer</span>
                    </button>
                  ) : (
                    /* In Trash view: show RESTAURER & SUPPRIMER DÉFINITIVEMENT */
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleRestore(selectedMessage.id)}
                        disabled={actionLoading}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition-colors shadow-2xs"
                        title="Restaurer la demande"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        <span>Restaurer</span>
                      </button>
                      <button
                        onClick={() => setPermanentDeleteModalOpen(true)}
                        disabled={actionLoading}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-rose-300 bg-rose-600 px-3 py-2 text-xs font-bold text-white hover:bg-rose-700 transition-colors shadow-2xs"
                        title="Supprimer définitivement"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Supprimer Définitivement</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Coordinates Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 p-4 rounded-2xl bg-abh-pearl/30 border border-abh-border/50">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Email :</span>
                  <a
                    href={`mailto:${selectedMessage.email}`}
                    className="font-semibold text-abh-sapphire hover:underline flex items-center gap-1.5 mt-0.5"
                  >
                    <Mail className="h-3.5 w-3.5 text-abh-amber" />
                    <span>{selectedMessage.email}</span>
                  </a>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                    Téléphone / WhatsApp :
                  </span>
                  <a
                    href={`tel:${selectedMessage.phone}`}
                    className="font-semibold text-abh-sapphire hover:underline flex items-center gap-1.5 mt-0.5"
                  >
                    <Phone className="h-3.5 w-3.5 text-abh-amber" />
                    <span>{selectedMessage.phone || 'Non renseigné'}</span>
                  </a>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                    Produit Demandé :
                  </span>
                  <span className="font-bold text-abh-midnight block mt-0.5">
                    {selectedMessage.product_interest}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                    Volume Estimé :
                  </span>
                  <span className="font-bold text-abh-midnight block mt-0.5">
                    {selectedMessage.quantity || 'Non précisé'}
                  </span>
                </div>
                {selectedMessage.destination_country && (
                  <div className="sm:col-span-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                      Destination / Incoterm :
                    </span>
                    <span className="font-semibold text-abh-midnight block mt-0.5">
                      {selectedMessage.destination_country}
                    </span>
                  </div>
                )}
              </div>

              {/* Message Content */}
              <div>
                <span className="font-bold text-abh-sapphire block mb-2 text-xs">
                  Message & Spécifications du Client :
                </span>
                <div className="p-4 rounded-2xl bg-abh-pearl/20 border border-abh-border/60 text-abh-slate leading-relaxed whitespace-pre-line text-xs font-normal">
                  {selectedMessage.message}
                </div>
              </div>

              {/* PIÈCE JOINTE / PHOTOS (w el tsawer yrahom el admin) */}
              {selectedMessage.file_attachment && (
                <div className="p-4 rounded-2xl bg-gradient-to-br from-abh-sand/20 to-abh-pearl/40 border border-abh-amber/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-abh-sapphire flex items-center gap-2">
                      {isImageFile(selectedMessage.file_attachment) ? (
                        <>
                          <ImageIcon className="h-4 w-4 text-abh-amber" />
                          <span>Photo / Image Transmise par le Client :</span>
                        </>
                      ) : (
                        <>
                          <FileText className="h-4 w-4 text-abh-amber" />
                          <span>Document Joint / Cahier des Charges :</span>
                        </>
                      )}
                    </span>
                    <a
                      href={selectedMessage.file_attachment}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-abh-sapphire hover:text-abh-amber hover:underline"
                    >
                      <ExternalLink className="h-3 w-3" />
                      <span>Ouvrir dans un nouvel onglet</span>
                    </a>
                  </div>

                  {/* VISUAL IMAGE PREVIEW */}
                  {isImageFile(selectedMessage.file_attachment) ? (
                    <div className="space-y-3">
                      <div className="relative group max-w-md overflow-hidden rounded-xl border border-abh-border shadow-md bg-white">
                        <img
                          src={selectedMessage.file_attachment}
                          alt="Pièce jointe client"
                          className="w-full max-h-72 object-contain bg-neutral-900/5 cursor-pointer transition-transform duration-300 group-hover:scale-102"
                          onClick={() => setLightboxImage(selectedMessage.file_attachment || null)}
                        />
                        <div
                          onClick={() => setLightboxImage(selectedMessage.file_attachment || null)}
                          className="absolute inset-0 bg-abh-midnight/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 cursor-pointer"
                        >
                          <span className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3 py-1.5 text-xs font-bold text-abh-sapphire shadow-lg">
                            <Eye className="h-3.5 w-3.5 text-abh-amber" />
                            <span>Agrandir la Photo</span>
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setLightboxImage(selectedMessage.file_attachment || null)}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-abh-border bg-white px-3 py-1.5 text-xs font-semibold text-abh-sapphire hover:bg-abh-pearl shadow-2xs transition-colors"
                        >
                          <Eye className="h-3.5 w-3.5 text-abh-amber" />
                          <span>Agrandir</span>
                        </button>
                        <a
                          href={selectedMessage.file_attachment}
                          download
                          className="inline-flex items-center gap-1.5 rounded-xl border border-abh-border bg-white px-3 py-1.5 text-xs font-semibold text-abh-sapphire hover:bg-abh-pearl shadow-2xs transition-colors"
                        >
                          <Download className="h-3.5 w-3.5 text-abh-amber" />
                          <span>Télécharger l'image</span>
                        </a>
                      </div>
                    </div>
                  ) : isPdfFile(selectedMessage.file_attachment) ? (
                    /* PDF DOCUMENT PREVIEW CARD */
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-white border border-abh-border">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600 border border-rose-200 shrink-0">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div className="truncate">
                          <p className="font-bold text-abh-sapphire truncate">Document PDF</p>
                          <p className="text-[11px] text-abh-slate truncate">
                            {selectedMessage.file_attachment.split('/').pop()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <a
                          href={selectedMessage.file_attachment}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-xl bg-abh-sapphire px-3 py-1.5 text-xs font-semibold text-white hover:bg-abh-midnight transition-colors"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>Consulter</span>
                        </a>
                        <a
                          href={selectedMessage.file_attachment}
                          download
                          className="inline-flex items-center gap-1.5 rounded-xl border border-abh-border bg-white px-3 py-1.5 text-xs font-semibold text-abh-sapphire hover:bg-abh-pearl transition-colors"
                        >
                          <Download className="h-3.5 w-3.5" />
                          <span>Télécharger</span>
                        </a>
                      </div>
                    </div>
                  ) : (
                    /* GENERIC DOCUMENT CARD */
                    <div className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-white border border-abh-border">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-200 shrink-0">
                          <FileText className="h-5 w-5" />
                        </div>
                        <span className="font-bold text-abh-sapphire truncate">
                          {selectedMessage.file_attachment.split('/').pop()}
                        </span>
                      </div>
                      <a
                        href={selectedMessage.file_attachment}
                        download
                        className="inline-flex items-center gap-1.5 rounded-xl bg-abh-sapphire px-3 py-1.5 text-xs font-semibold text-white hover:bg-abh-midnight transition-colors"
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span>Télécharger</span>
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* Internal Commercial Follow-up Notes */}
              <div className="pt-4 border-t border-gray-100 space-y-2.5">
                <span className="font-bold text-abh-sapphire block text-xs">
                  Notes Internes de Suivi Commercial :
                </span>
                <textarea
                  rows={3}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Ex : Cotation CIF Marseille transmise le 30/10. Échantillons expédiés par DHL..."
                  className="w-full rounded-2xl border border-abh-border p-3 focus:outline-none focus:border-abh-amber bg-abh-pearl/30 text-xs"
                />
                <button
                  type="button"
                  onClick={() => saveNotes(selectedMessage.id)}
                  className="rounded-xl bg-abh-sapphire px-4 py-2 text-white font-semibold hover:bg-abh-midnight transition-colors shadow-2xs"
                >
                  Enregistrer la Note
                </button>
              </div>
            </div>
          ) : (
            <div className="py-24 text-center text-xs text-abh-slate flex flex-col items-center justify-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-abh-pearl text-abh-sapphire">
                <Inbox className="h-6 w-6 text-abh-amber" />
              </div>
              <p className="font-medium">
                Sélectionnez une demande dans la liste à gauche pour consulter l'intégralité du devis.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ============================================================ */}
      {/* MODAL 1: CONFIRMATION METTRE À LA CORBEILLE (ALERT MEZYENA) */}
      {/* ============================================================ */}
      {trashModalOpen && selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-abh-midnight/70 backdrop-blur-sm animate-fade-in-up">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-rose-100">
            <button
              onClick={() => setTrashModalOpen(false)}
              className="absolute right-4 top-4 rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-3.5 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 shrink-0">
                <Trash2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-heading font-bold text-abh-sapphire">
                  Déplacer vers la Corbeille ?
                </h3>
                <p className="text-xs text-abh-slate">Demande commerciale</p>
              </div>
            </div>

            <div className="rounded-2xl bg-rose-50/50 border border-rose-100 p-3.5 mb-4 text-xs space-y-1">
              <p className="font-bold text-rose-950">{selectedMessage.company_name}</p>
              <p className="text-rose-800">
                Client : {selectedMessage.full_name} ({selectedMessage.country})
              </p>
              <p className="text-rose-700 font-medium">Produit : {selectedMessage.product_interest}</p>
            </div>

            <p className="text-xs text-abh-slate leading-relaxed mb-6">
              Cette demande sera déplacée dans la <strong>corbeille sécurisée</strong>. Elle y sera conservée pendant{' '}
              <strong>7 jours</strong> avant sa purge automatique. Vous pouvez la restaurer à tout moment avant
              l'expiration.
            </p>

            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setTrashModalOpen(false)}
                disabled={actionLoading}
                className="rounded-xl border border-abh-border bg-white px-4 py-2 text-xs font-semibold text-abh-slate hover:bg-abh-pearl transition-colors"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleMoveToTrash}
                disabled={actionLoading}
                className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700 shadow-md transition-colors disabled:opacity-50"
              >
                {actionLoading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                <span>Mettre à la Corbeille</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 2: CONFIRMATION SUPPRESSION DÉFINITIVE                 */}
      {/* ============================================================ */}
      {permanentDeleteModalOpen && selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-abh-midnight/70 backdrop-blur-sm animate-fade-in-up">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-red-200">
            <button
              onClick={() => setPermanentDeleteModalOpen(false)}
              className="absolute right-4 top-4 rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-3.5 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600 border border-red-300 shrink-0">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-heading font-bold text-red-700">Suppression Définitive</h3>
                <p className="text-xs text-abh-slate">Action irréversible</p>
              </div>
            </div>

            <p className="text-xs text-abh-slate leading-relaxed mb-6">
              Êtes-vous certain de vouloir supprimer définitivement la demande de{' '}
              <strong>{selectedMessage.company_name}</strong> ? Toutes les informations, messages et pièces jointes
              seront immédiatement et définitivement détruits.
            </p>

            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setPermanentDeleteModalOpen(false)}
                disabled={actionLoading}
                className="rounded-xl border border-abh-border bg-white px-4 py-2 text-xs font-semibold text-abh-slate hover:bg-abh-pearl transition-colors"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleDeletePermanently}
                disabled={actionLoading}
                className="inline-flex items-center gap-2 rounded-xl bg-red-700 px-4 py-2 text-xs font-bold text-white hover:bg-red-800 shadow-md transition-colors disabled:opacity-50"
              >
                {actionLoading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                <span>Supprimer Définitivement</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 3: LIGHTBOX VISUALISEUR D'IMAGE PLEIN ÉCRAN            */}
      {/* ============================================================ */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in-up"
          onClick={() => setLightboxImage(null)}
        >
          <div
            className="relative max-w-4xl max-h-[92vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute -top-12 right-0 rounded-full bg-white/20 p-2 text-white hover:bg-white/40 transition-colors"
              title="Fermer (Échap)"
            >
              <X className="h-5 w-5" />
            </button>

            <img
              src={lightboxImage}
              alt="Aperçu agrandi"
              className="max-h-[80vh] max-w-full rounded-2xl object-contain shadow-2xl border border-white/10"
            />

            <div className="mt-4 flex items-center gap-3">
              <a
                href={lightboxImage}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-white/20 backdrop-blur-md px-4 py-2 text-xs font-semibold text-white hover:bg-white/30 transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Ouvrir dans un onglet</span>
              </a>
              <a
                href={lightboxImage}
                download
                className="inline-flex items-center gap-2 rounded-xl bg-abh-amber px-4 py-2 text-xs font-bold text-abh-midnight hover:bg-abh-amber/90 transition-colors shadow-lg"
              >
                <Download className="h-4 w-4" />
                <span>Télécharger la Photo</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
