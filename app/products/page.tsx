'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { QuoteModal } from '@/components/ui/QuoteModal';
import { Product } from '@/lib/types';
import { ArrowRight, Sparkles, Filter, ShieldCheck, Check } from 'lucide-react';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [selectedProductForQuote, setSelectedProductForQuote] = useState<string>('');

  useEffect(() => {
    fetch('/api/admin/products')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProducts(data);
        }
      })
      .catch((err) => console.error('Error fetching products:', err))
      .finally(() => setLoading(false));
  }, []);

  const categories = [
    { id: 'all', label: 'Toutes les Huiles' },
    { id: 'extra', label: 'Vierge Extra & Bio' },
    { id: 'industrial', label: 'Raffinée & Grignons' },
  ];

  const filteredProducts = products.filter((p) => {
    if (selectedCategory === 'extra') {
      return p.slug.includes('extra') || p.slug.includes('bio');
    }
    if (selectedCategory === 'industrial') {
      return p.slug.includes('raffine') || p.slug.includes('grignon');
    }
    return true;
  });

  return (
    <>
      <Header />

      <main className="min-h-screen pt-28 pb-24 bg-abh-pearl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header section */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 rounded-full bg-abh-sand/60 px-3.5 py-1 text-xs font-semibold text-abh-sapphire mb-3">
              <Sparkles className="h-3.5 w-3.5 text-abh-amber" />
              <span>Gamme Export B2B — Fûts, IBC & Flexitanks</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-heading font-bold text-abh-sapphire">
              Catalogue des Huiles d Olive & Bio en Vrac
            </h1>
            <p className="text-sm sm:text-base text-abh-slate mt-3 leading-relaxed">
              Découvrez les spécifications physico-chimiques complètes de nos huiles récoltées et pressées à froid au gouvernorat de Kairouan, conformes aux exigences du Conseil Oléicole International (COI).
            </p>

            {/* Category Filter */}
            <div className="mt-8 flex items-center justify-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`rounded-full px-5 py-2 text-xs font-semibold transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-abh-sapphire text-white shadow-sm'
                      : 'bg-white text-abh-midnight hover:bg-abh-sand/30 border border-abh-border'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Product grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-96 rounded-2xl bg-abh-sand/30 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((p) => {
                const trans = p.translations?.fr || Object.values(p.translations || {})[0] || {};
                return (
                  <div
                    key={p.id}
                    className="group rounded-2xl bg-white overflow-hidden border border-abh-border shadow-card card-hover flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative aspect-[4/3] overflow-hidden bg-abh-pearl">
                        <Image
                          src={p.hero_image || '/images/products/extra-vierge.jpg'}
                          alt={trans.title || p.slug}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute top-3 left-3 rounded-full bg-abh-midnight/80 backdrop-blur-md px-3 py-1 text-[11px] font-semibold text-abh-amber border border-white/20">
                          Acidité ≤ {p.acidity_max}%
                        </div>
                      </div>

                      <div className="p-5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-abh-amber block mb-1">
                          {p.specs?.origin || 'Bouhajla, Tunisie'}
                        </span>
                        <h2 className="text-lg font-heading font-bold text-abh-sapphire mb-2 group-hover:text-abh-amber transition-colors">
                          {trans.title || p.slug}
                        </h2>
                        <p className="text-xs text-abh-slate leading-relaxed mb-4 line-clamp-3">
                          {trans.short_description || trans.description}
                        </p>

                        <div className="space-y-1.5 py-3 border-y border-gray-100 text-[11px] text-abh-slate">
                          <div className="flex justify-between">
                            <span>Variété :</span>
                            <span className="font-medium text-abh-midnight">{p.specs?.variety || 'Chemlali'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Extraction :</span>
                            <span className="font-medium text-abh-midnight">{p.specs?.extraction || 'Extraction à froid'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>MOQ :</span>
                            <span className="font-medium text-abh-midnight">{p.specs?.moq || '1 Conteneur 20ft'}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 pt-0 space-y-2">
                      <Link
                        href={`/products/${p.slug}`}
                        className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-abh-sapphire py-2.5 text-xs font-semibold text-white hover:bg-abh-midnight transition-colors"
                      >
                        <span>Fiche Technique Détaillée</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedProductForQuote(trans.title || p.slug);
                          setQuoteModalOpen(true);
                        }}
                        className="w-full rounded-xl border border-abh-amber/40 bg-abh-sand/15 py-2 text-xs font-semibold text-abh-amber hover:bg-abh-amber hover:text-white transition-colors"
                      >
                        Demander une Cotation
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Bottom assurance */}
          <div className="mt-16 rounded-2xl bg-white p-8 border border-abh-border shadow-xs">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <ShieldCheck className="h-6 w-6 text-abh-amber mx-auto mb-2" />
                <h4 className="text-sm font-bold text-abh-sapphire">Analyses Indépendantes</h4>
                <p className="text-xs text-abh-slate mt-1">Chaque expédition est accompagnée d un bulletin officiel délivré par un laboratoire accrédité COI.</p>
              </div>
              <div>
                <Sparkles className="h-6 w-6 text-abh-amber mx-auto mb-2" />
                <h4 className="text-sm font-bold text-abh-sapphire">Inertage Sous Azote</h4>
                <p className="text-xs text-abh-slate mt-1">Stockage et chargement sous atmosphère contrôlée pour neutraliser l oxydation de l huile.</p>
              </div>
              <div>
                <ArrowRight className="h-6 w-6 text-abh-amber mx-auto mb-2" />
                <h4 className="text-sm font-bold text-abh-sapphire">Échantillons Gratuits</h4>
                <p className="text-xs text-abh-slate mt-1">Envoi d échantillons scellés de 250ml par DHL/FedEx sur simple demande pour les acheteurs B2B.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <QuoteModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        defaultProduct={selectedProductForQuote}
      />
    </>
  );
}
