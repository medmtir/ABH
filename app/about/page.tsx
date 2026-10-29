'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import {
  Sparkles,
  ShieldCheck,
  Award,
  Building2,
  TreePine,
  Factory,
  CheckCircle2,
  ArrowRight,
  MapPin,
  FileCheck,
} from 'lucide-react';

export default function AboutPage() {
  return (
    <>
      <Header />

      <main className="min-h-screen pt-28 pb-24 bg-abh-pearl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 rounded-full bg-abh-sand/60 px-3.5 py-1 text-xs font-semibold text-abh-sapphire mb-3">
              <Sparkles className="h-3.5 w-3.5 text-abh-amber" />
              <span>Notre Identité & Nos Valeurs</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-heading font-bold text-abh-sapphire">
              Authentic Bio Huile Company (ABH)
            </h1>
            <p className="text-sm sm:text-base text-abh-slate mt-3 leading-relaxed">
              De la plaine oléicole de Bouhajla jusqu aux plus grands terminaux maritimes mondiaux : une vision moderne de l exportation oléicole tunisienne.
            </p>
          </div>

          {/* Grid: Presentation & Official Registration */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
            <div className="lg:col-span-7 space-y-6">
              <h2 className="text-2xl sm:text-3xl font-heading font-bold text-abh-sapphire">
                L Alliance de la Richesse Terroir et de l Ingénierie Commerciale Internationale
              </h2>
              <p className="text-xs sm:text-sm text-abh-slate leading-relaxed">
                Immatriculée au Registre National des Entreprises (RNE 1956962P), <b>Authentic Bio Huile Company</b> est une société à responsabilité limitée de commerce international spécialisée dans la sélection, la conservation sous azote et l expédition maritime d huiles d olive de qualité supérieure.
              </p>
              <p className="text-xs sm:text-sm text-abh-slate leading-relaxed">
                Située à Bouhajla, au cœur du gouvernorat de Kairouan, la région bénéficie d un ensoleillement généreux et d un microclimat semi-aride exceptionnel. Ce climat particulier confère à l olive locale (notamment la variété endémique <i>Chemlali</i>) une concentration remarquable en antioxydants naturels et en polyphénols, gage d une résistance optimale à l oxydation lors des longs trajets maritimes.
              </p>

              {/* RNE Official Box */}
              <div className="rounded-2xl bg-white p-6 border border-abh-border shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-abh-sapphire uppercase tracking-wider">
                  <FileCheck className="h-4 w-4 text-abh-amber" />
                  <span>Données Officielles du Registre National des Entreprises</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 rounded-xl bg-abh-pearl/50 border border-abh-border/40">
                    <span className="text-gray-400 block text-[10px]">Dénomination Sociale :</span>
                    <span className="font-semibold text-abh-midnight">Authentic Bio Huile Company</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-abh-pearl/50 border border-abh-border/40">
                    <span className="text-gray-400 block text-[10px]">Identifiant Unique RNE :</span>
                    <span className="font-mono font-bold text-abh-amber">1956962P</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-abh-pearl/50 border border-abh-border/40">
                    <span className="text-gray-400 block text-[10px]">Activité :</span>
                    <span className="font-semibold text-abh-midnight">Société de Commerce International</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-abh-pearl/50 border border-abh-border/40">
                    <span className="text-gray-400 block text-[10px]">Gérance Exécutive :</span>
                    <span className="font-semibold text-abh-midnight">بديع عماري (Badi Ammari)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden shadow-premium border border-abh-border bg-white p-2">
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
                  <Image
                    src="/images/facility/olive-grove.jpg"
                    alt="Oliveraies de Kairouan ABH"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-abh-midnight/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white text-xs">
                    <p className="font-bold text-abh-amber">Oliveraies Séculaires de Kairouan</p>
                    <p className="text-[11px] text-gray-200">Cueillette soignée et première pression à froid dans les 12 heures.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3 Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
            <div className="rounded-2xl bg-white p-6 border border-abh-border shadow-xs card-hover">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-abh-sand/40 text-abh-amber mb-4">
                <TreePine className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-abh-sapphire mb-2">Notre Mission</h3>
              <p className="text-xs text-abh-slate leading-relaxed">
                Valoriser l or vert tunisien sur les marchés les plus exigeants (Europe, Amérique du Nord, Asie) en assurant une qualité analytique constante, lot après lot, sans compromis sur la pureté.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 border border-abh-border shadow-xs card-hover">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-abh-sand/40 text-abh-amber mb-4">
                <Factory className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-abh-sapphire mb-2">Notre Infrastructure</h3>
              <p className="text-xs text-abh-slate leading-relaxed">
                Une cuvisterie moderne en acier inoxydable alimentaire, des systèmes d inertage d azote de dernière génération et une capacité logistique de chargement continu pour conteneurs Flexitank 24 000L.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 border border-abh-border shadow-xs card-hover">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-abh-sand/40 text-abh-amber mb-4">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-abh-sapphire mb-2">Nos Engagements Qualité</h3>
              <p className="text-xs text-abh-slate leading-relaxed">
                Transparence contractuelle, bulletins d analyses émis par des laboratoires agréés COI, stricte application des normes BRC, ISO 22000, IFS, Halal, Kosher et Agriculture Biologique.
              </p>
            </div>
          </div>

          {/* Direction profile */}
          <div className="rounded-2xl bg-white p-8 border border-abh-border shadow-premium max-w-3xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
              <div className="relative h-28 w-28 shrink-0 rounded-2xl overflow-hidden border-2 border-abh-amber shadow-md">
                <Image
                  src="/images/cards/badie-amarie.jpg"
                  alt="بديع عماري Badi Ammari"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-abh-amber">Direction Générale</span>
                <h3 className="text-xl font-heading font-bold text-abh-sapphire">
                  بديع عماري (Badi Ammari)
                </h3>
                <p className="text-xs font-medium text-abh-slate">
                  Gérant & Directeur des Opérations Internationales
                </p>
                <p className="text-xs text-abh-slate pt-2 leading-relaxed">
                  « Chez ABH, chaque expédition maritime engage notre réputation familiale et le prestige de l oléiculture tunisienne. Nous traitons chaque cahier des charges avec une exigence absolue de pureté. »
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
