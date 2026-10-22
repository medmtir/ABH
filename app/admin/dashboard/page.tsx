'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Inbox,
  Boxes,
  Users,
  Award,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  Globe2,
  Clock,
  Sparkles,
} from 'lucide-react';

export default function AdminOverviewPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [productsCount, setProductsCount] = useState(0);
  const [certsCount, setCertsCount] = useState(0);
  const [ordersSummary, setOrdersSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/messages').then((r) => r.json()).catch(() => []),
      fetch('/api/admin/products').then((r) => r.json()).catch(() => []),
      fetch('/api/admin/certifications').then((r) => r.json()).catch(() => []),
      fetch('/api/admin/orders').then((r) => r.json()).catch(() => null),
    ])
      .then(([msgs, prods, certs, ords]) => {
        if (Array.isArray(msgs)) setMessages(msgs);
        if (Array.isArray(prods)) setProductsCount(prods.length);
        if (Array.isArray(certs)) setCertsCount(certs.length);
        if (ords) setOrdersSummary(ords);
      })
      .finally(() => setLoading(false));
  }, []);

  const unreadMessages = messages.filter((m) => m.status === 'unread');

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-abh-sapphire to-abh-midnight p-6 text-white shadow-premium">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-abh-amber mb-2">
            <Sparkles className="h-3 w-3" />
            <span>Direction Générale ABH — Bouhajla (Kairouan)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold">
            Tableau de Bord & Centre de Contrôle
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 mt-1">
            Supervisez les demandes de devis internationales, commandes maritimes et catalogues.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/dashboard/messages"
            className="rounded-xl bg-gradient-to-r from-abh-amber to-abh-copper px-4 py-2.5 text-xs font-semibold text-white shadow-md hover:scale-105 transition-all"
          >
            Consulter les Devis ({unreadMessages.length})
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="rounded-2xl bg-white p-5 border border-abh-border shadow-xs card-hover">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-abh-slate">Devis en Attente</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-abh-amber">
              <Inbox className="h-5 w-5" />
            </div>
          </div>
          <div className="text-3xl font-heading font-bold text-abh-sapphire">
            {unreadMessages.length}
          </div>
          <p className="text-[11px] text-abh-slate mt-1">
            {messages.length} demandes totales reçues
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 border border-abh-border shadow-xs card-hover">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-abh-slate">Commandes Actives</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-abh-sapphire">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="text-3xl font-heading font-bold text-abh-sapphire">
            {ordersSummary?.total_orders || 0}
          </div>
          <p className="text-[11px] text-abh-slate mt-1">
            Clients B2B & livraisons BL
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 border border-abh-border shadow-xs card-hover">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-abh-slate">Produits Catalogue</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Boxes className="h-5 w-5" />
            </div>
          </div>
          <div className="text-3xl font-heading font-bold text-abh-sapphire">
            {productsCount}
          </div>
          <p className="text-[11px] text-abh-slate mt-1">
            Huiles extra vierges, bio & industrielles
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 border border-abh-border shadow-xs card-hover">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-abh-slate">Certifications Qualité</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <Award className="h-5 w-5" />
            </div>
          </div>
          <div className="text-3xl font-heading font-bold text-abh-sapphire">
            {certsCount}
          </div>
          <p className="text-[11px] text-abh-slate mt-1">
            BRC, ISO, IFS, BIO, Halal, Kosher
          </p>
        </div>
      </div>

      {/* Financial Overview (EUR, TND, USD) */}
      {ordersSummary?.kpis && (
        <div className="rounded-2xl bg-white p-6 border border-abh-border shadow-xs">
          <h3 className="text-sm font-bold text-abh-sapphire uppercase tracking-wider mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-abh-amber" />
            <span>Indicateurs Financiers par Devise</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(['EUR', 'TND', 'USD'] as const).map((curr) => {
              const kpi = ordersSummary.kpis[curr] || { total: 0, paid: 0, remaining: 0 };
              return (
                <div key={curr} className="p-4 rounded-xl bg-abh-pearl/40 border border-abh-border/60">
                  <div className="text-xs font-bold text-abh-amber mb-2">{curr}</div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-abh-slate">Volume d affaires :</span>
                      <span className="font-semibold text-abh-midnight">{kpi.total.toLocaleString()} {curr}</span>
                    </div>
                    <div className="flex justify-between text-emerald-600">
                      <span>Encaissé :</span>
                      <span className="font-semibold">{kpi.paid.toLocaleString()} {curr}</span>
                    </div>
                    <div className="flex justify-between text-amber-700">
                      <span>Reste à percevoir :</span>
                      <span className="font-semibold">{kpi.remaining.toLocaleString()} {curr}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent RFQ messages */}
      <div className="rounded-2xl bg-white p-6 border border-abh-border shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-abh-sapphire uppercase tracking-wider flex items-center gap-2">
            <Inbox className="h-4 w-4 text-abh-amber" />
            <span>Demandes Récentes de Cotation (RFQ)</span>
          </h3>
          <Link
            href="/admin/dashboard/messages"
            className="text-xs font-semibold text-abh-amber hover:underline flex items-center gap-1"
          >
            <span>Voir toute la boîte</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {messages.length === 0 ? (
          <div className="py-8 text-center text-xs text-abh-slate">
            Aucune demande de devis reçue pour le moment.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {messages.slice(0, 5).map((msg) => (
              <div key={msg.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div>
                  <span className="font-bold text-abh-midnight mr-2">{msg.company_name}</span>
                  <span className="text-abh-slate">({msg.full_name} — {msg.country})</span>
                  <p className="text-[11px] text-abh-copper mt-0.5">
                    Produit : {msg.product_interest} • Quantité : {msg.quantity || 'Non précisé'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                      msg.status === 'unread'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {msg.status === 'unread' ? 'Nouveau' : msg.status}
                  </span>
                  <span className="text-[11px] text-gray-400">
                    {new Date(msg.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
