'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { QuoteModal } from '@/components/ui/QuoteModal';
import { Product } from '@/lib/types';
import {
  ArrowLeft,
  ShieldCheck,
  Award,
  Sparkles,
  Send,
  Boxes,
  FileText,
  CheckCircle2,
} from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string>('');
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);

  useEffect(() => {
    if (!slug) return;
    fetch('/api/admin/products')
      .then((res) => res.json())
      .then((data: Product[]) => {
        const found = data.find((p) => p.slug === slug);
        if (found) {
          setProduct(found);
          setActiveImage(found.hero_image);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen pt-32 pb-20 max-w-7xl mx-auto px-4 animate-pulse">
          <div className="h-8 bg-abh-sand/40 rounded w-1/4 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="aspect-square bg-abh-sand/30 rounded-2xl" />
            <div className="space-y-4">
              <div className="h-10 bg-abh-sand/40 rounded w-3/4" />
              <div className="h-6 bg-abh-sand/30 rounded w-1/2" />
              <div className="h-32 bg-abh-sand/20 rounded" />
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header />
        <div className="min-h-screen pt-40 pb-20 text-center max-w-xl mx-auto px-4">
          <h1 className="text-2xl font-bold font-heading text-abh-sapphire mb-4">
            Produit Introuvable
          </h1>
          <p className="text-sm text-abh-slate mb-6">
            La fiche technique que vous recherchez n existe pas ou a été déplacée.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-xl bg-abh-sapphire px-6 py-2.5 text-xs font-semibold text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Retour au Catalogue</span>
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  const trans = product.translations?.fr || Object.values(product.translations || {})[0] || {};
  const gallery = [product.hero_image, ...(product.gallery_images || [])].filter(Boolean);

  return (
    <>
      <Header />

      <main className="min-h-screen pt-28 pb-24 bg-abh-pearl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="mb-6 flex items-center gap-2 text-xs text-abh-slate">
            <Link href="/" className="hover:text-abh-sapphire">Accueil</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-abh-sapphire">Catalogue Produits</Link>
            <span>/</span>
            <span className="font-semibold text-abh-sapphire">{trans.title}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left: Gallery */}
            <div className="lg:col-span-6 space-y-4">
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-white border border-abh-border shadow-card">
                <Image
                  src={activeImage || product.hero_image}
                  alt={trans.title}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute top-4 left-4 rounded-full bg-abh-midnight/80 backdrop-blur-md px-3.5 py-1 text-xs font-bold text-abh-amber border border-white/20">
                  Acidité Garantie ≤ {product.acidity_max}%
                </div>
              </div>

              {gallery.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  {gallery.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImage(img)}
                      className={`relative h-20 w-20 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                        activeImage === img
                          ? 'border-abh-amber ring-2 ring-abh-amber/30'
                          : 'border-abh-border hover:border-abh-sapphire'
                      }`}
                    >
                      <Image src={img} alt="" fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Quality & Certifications badges */}
              <div className="rounded-2xl bg-white p-5 border border-abh-border shadow-xs">
                <h4 className="text-xs font-bold text-abh-sapphire uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Award className="h-4 w-4 text-abh-amber" />
                  <span>Accréditations & Certifications Associées</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {(product.certifications || ['ISO 22000', 'BIO']).map((c, i) => (
                    <span
                      key={i}
                      className="rounded-lg bg-abh-sand/30 px-3 py-1 text-xs font-semibold text-abh-sapphire border border-abh-border/60"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Technical specifications */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-abh-amber block mb-1">
                  Origine : {product.specs?.origin || 'Bouhajla, Kairouan (Tunisie)'}
                </span>
                <h1 className="text-3xl sm:text-4xl font-heading font-bold text-abh-sapphire">
                  {trans.title}
                </h1>
                <p className="text-base text-abh-copper font-medium mt-1">
                  {trans.subtitle}
                </p>
              </div>

              <div className="rounded-2xl bg-white p-6 border border-abh-border shadow-xs space-y-3">
                <h3 className="text-sm font-bold text-abh-sapphire flex items-center gap-2">
                  <FileText className="h-4 w-4 text-abh-amber" />
                  <span>Profil & Description Détaillée</span>
                </h3>
                <p className="text-xs sm:text-sm text-abh-slate leading-relaxed">
                  {trans.description}
                </p>
              </div>

              {/* Specifications table */}
              <div className="rounded-2xl bg-white border border-abh-border shadow-xs overflow-hidden">
                <div className="px-6 py-4 bg-abh-sapphire text-white flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider">Paramètres Physico-Chimiques</span>
                  <span className="text-[11px] text-abh-amber font-mono">Normes COI</span>
                </div>
                <div className="divide-y divide-gray-100 text-xs">
                  <div className="px-6 py-3 flex justify-between bg-white">
                    <span className="text-abh-slate font-medium">Taux d Acidité Libre :</span>
                    <span className="font-bold text-abh-sapphire">{product.specs?.acidity || `≤ ${product.acidity_max}%`}</span>
                  </div>
                  <div className="px-6 py-3 flex justify-between bg-abh-pearl/40">
                    <span className="text-abh-slate font-medium">Variété d Olives :</span>
                    <span className="font-bold text-abh-sapphire">{product.specs?.variety}</span>
                  </div>
                  <div className="px-6 py-3 flex justify-between bg-white">
                    <span className="text-abh-slate font-medium">Méthode d Extraction :</span>
                    <span className="font-bold text-abh-sapphire">{product.specs?.extraction}</span>
                  </div>
                  <div className="px-6 py-3 flex justify-between bg-abh-pearl/40">
                    <span className="text-abh-slate font-medium">Terroir d Origine :</span>
                    <span className="font-bold text-abh-sapphire">{product.specs?.origin}</span>
                  </div>
                  <div className="px-6 py-3 flex justify-between bg-white">
                    <span className="text-abh-slate font-medium">Conditionnements Export :</span>
                    <span className="font-bold text-abh-sapphire">{product.specs?.packaging}</span>
                  </div>
                  <div className="px-6 py-3 flex justify-between bg-abh-pearl/40">
                    <span className="text-abh-slate font-medium">Quantité Minimum (MOQ) :</span>
                    <span className="font-bold text-abh-sapphire">{product.specs?.moq}</span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-2 space-y-3">
                <button
                  type="button"
                  onClick={() => setQuoteModalOpen(true)}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-abh-amber to-abh-copper py-3.5 px-6 text-sm font-bold text-white shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all"
                >
                  <Send className="h-4 w-4" />
                  <span>Demander une Cotation Incoterms (FOB / CIF)</span>
                </button>

                <p className="text-[11px] text-center text-abh-slate">
                  Expédition rapide d échantillons scellés de 250ml par DHL pour validation en laboratoire.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <QuoteModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        defaultProduct={trans.title}
      />
    </>
  );
}
