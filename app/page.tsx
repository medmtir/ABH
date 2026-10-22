'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { QuoteModal } from '@/components/ui/QuoteModal';
import {
  ArrowRight,
  ShieldCheck,
  Award,
  Globe2,
  TrendingUp,
  CheckCircle2,
  ChevronDown,
  Sparkles,
  Ship,
  Boxes,
  Factory,
  Check,
  FileCheck2,
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n/context';

export default function HomePage() {
  const { t } = useLanguage();
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const stats = [
    { value: '25+', label: 'Pays Desservis dans le Monde', icon: Globe2 },
    { value: '5 000+', label: 'Tonnes Exportées par An', icon: TrendingUp },
    { value: '6', label: 'Certifications Internationales', icon: Award },
    { value: '100%', label: 'Traçabilité Oliveraie & Port', icon: ShieldCheck },
  ];

  const productsPreview = [
    {
      slug: 'huile-olive-extra-vierge',
      title: "Huile d'Olive Vierge Extra",
      acidity: '≤ 0.8%',
      variety: 'Chemlali & Chétoui',
      image: '/images/products/extra-vierge.jpg',
      badge: 'Bestseller Export',
      desc: 'Première extraction mécanique à froid (< 27°C). Idéale pour embouteilleurs et négociants mondiaux.',
    },
    {
      slug: 'huile-olive-biologique',
      title: "Huile d'Olive Biologique Certifiée",
      acidity: '≤ 0.5%',
      variety: 'Chemlali Bio',
      image: '/images/products/olive-bio.jpg',
      badge: 'Certifiée BIO UE & USDA',
      desc: 'Zéro pesticide ni engrais chimique. Teneur maximale en polyphénols antioxydants.',
    },
    {
      slug: 'huile-olive-raffinee',
      title: "Huile d'Olive Raffinée",
      acidity: '≤ 0.3%',
      variety: 'Olives tunisiennes sélectionnées',
      image: '/images/products/raffine.jpg',
      badge: 'Usage Agroalimentaire',
      desc: 'Point de fumée élevé et neutralité gustative pour conserveries, sauces et formulation industrielle.',
    },
    {
      slug: 'huile-grignons-olive',
      title: "Huile de Grignons d'Olive",
      acidity: '≤ 1.0%',
      variety: 'Grignons d olives',
      image: '/images/products/grignons.jpg',
      badge: 'Rapport Qualité/Prix',
      desc: 'Excellente résistance aux hautes températures. Idéale pour friture continue et cosmétique.',
    },
  ];

  const packagings = [
    {
      title: 'Flexitank 20ft FCL',
      capacity: '24 000 Litres',
      desc: 'Poche aseptique alimentaire monocouche ou multicouche certifiée COA, intégrée dans un conteneur 20 pieds standard.',
      ideal: 'Grands importateurs & raffineurs',
      image: '/images/packaging/ibc-container.jpg',
    },
    {
      title: 'Cuves IBC / GRV 1 000L',
      capacity: '1 000 Litres (≈ 920 kg)',
      desc: 'Cuve PEHD rigide sous cage en acier galvanisé avec vanne scellée et palette bois ou plastique intégrée.',
      ideal: 'Usines de conditionnement moyennes',
      image: '/images/packaging/ibc-container.jpg',
    },
    {
      title: 'Fûts Métalliques Revêtus',
      capacity: '208 Litres (≈ 190 kg)',
      desc: 'Fûts en acier laminé à froid avec vernis intérieur époxy alimentaire certifié. Palettisables par 4 fûts.',
      ideal: 'Distributeurs régionaux & réexpédition',
      image: '/images/packaging/steel-drum.jpg',
    },
    {
      title: 'Seaux & Jerricans PEHD',
      capacity: '10 à 25 Litres',
      desc: 'Emballages semi-gros avec poignée ergonomique et bouchon inviolable anti-goutte.',
      ideal: 'Canal Horeca & Restauration',
      image: '/images/packaging/pails-buckets.jpg',
    },
  ];

  const faqs = [
    {
      q: 'Quel est le volume minimum de commande (MOQ) pour l exportation ?',
      a: 'Pour le vrac maritime en Flexitank, le MOQ standard est de 1 conteneur de 20 pieds (soit environ 21 à 22 tonnes métriques). Pour les cuves IBC de 1 000L ou les fûts de 208L, nous pouvons grouper les commandes à partir de 5 à 10 tonnes.',
    },
    {
      q: 'Quels Incoterms proposez-vous ?',
      a: 'Nous proposons l ensemble des Incoterms maritimes standards : FOB (Ports de Radès, Sousse ou Bizerte), CFR (Coût et Fret jusqu à votre port de destination) et CIF (avec assurance maritime tous risques incluse).',
    },
    {
      q: 'Quelles certifications et analyses de laboratoire accompagnez-vous ?',
      a: 'Chaque lot expédié est certifié par des laboratoires accrédités COI (Conseil Oléicole International) : acidité libre, indice de peroxyde, absorbance UV (K232, K270, Delta K), profil d acides gras et analyse organoleptique par panel accrédité. Nos installations respectent les normes BRC Food, ISO 22000, IFS, Halal, Kosher et BIO (UE/USDA).',
    },
    {
      q: 'Pouvez-vous fournir des échantillons avant contractualisation ?',
      a: 'Oui, nous expédions par messagerie express (DHL/FedEx) des échantillons scellés de 250ml ou 500ml accompagnés de leur bulletin d analyse pour validation gustative et physico-chimique par vos laboratoires.',
    },
    {
      q: 'Quels sont les délais d expédition maritime ?',
      a: 'Nos expéditions partent généralement sous 7 à 12 jours ouvrés après confirmation du contrat et ouverture des instruments de paiement (Crédit Documentaire L/C ou virement bancaire SWIFT). Le temps de transit maritime dépend du port de destination (3 à 6 jours pour l Europe du Sud, 14 à 20 jours pour l Asie et les Amériques).',
    },
  ];

  return (
    <>
      <Header />

      <main className="min-h-screen pt-20">
        {/* ================= HERO SECTION ================= */}
        <section className="relative overflow-hidden bg-gradient-to-b from-abh-sapphire via-abh-midnight to-[#0a160b] text-white pt-16 pb-24 sm:pt-24 sm:pb-32">
          {/* Subtle geometric background overlay */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D4930D_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

          {/* Ambient glow */}
          <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-abh-amber/15 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-abh-sapphire/40 blur-3xl pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Headlines */}
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md px-3.5 py-1.5 text-xs font-semibold text-abh-amber border border-white/15">
                  <Sparkles className="h-3.5 w-3.5 text-abh-amber" />
                  <span>Société de Commerce International — RNE 1956962P</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold tracking-tight text-white leading-[1.15]">
                  L Excellence des Huiles Bio & d Olive Tunisiennes en <span className="text-gradient-gold">Vrac Maritime</span>
                </h1>

                <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto lg:mx-0 font-light leading-relaxed">
                  Basée à Bouhajla au cœur du gouvernorat de Kairouan, <b>Authentic Bio Huile Company (ABH)</b> sélectionne, stocke sous azote et exporte des huiles d exception en Flexitanks 24 000L et fûts vers les cinq continents.
                </p>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                  <button
                    type="button"
                    onClick={() => setQuoteModalOpen(true)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-abh-amber to-abh-copper px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-abh-amber/25 hover:shadow-xl hover:scale-[1.02] transition-all"
                  >
                    <span>Demander une Cotation (RFQ)</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>

                  <Link
                    href="/products"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-white/10 backdrop-blur-md px-7 py-3.5 text-sm font-semibold text-white hover:bg-white/15 border border-white/20 transition-colors"
                  >
                    <span>Découvrir le Catalogue</span>
                  </Link>
                </div>

                {/* Trust badges */}
                <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-gray-400">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-abh-amber" />
                    <span>Conformité COI Garantie</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-abh-amber" />
                    <span>Contrôle Qualité Lot par Lot</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-abh-amber" />
                    <span>Départs Maritimes Hebdomadaires</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Hero Visual Card */}
              <div className="lg:col-span-5">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/15 bg-white/5 backdrop-blur-md p-2">
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
                    <Image
                      src="/images/facility/storage-tanks.jpg"
                      alt="Installations industrielles ABH Company Kairouan"
                      fill
                      className="object-cover"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-abh-midnight/90 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-abh-midnight/80 backdrop-blur-md border border-white/15 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-abh-amber font-semibold uppercase tracking-wider">Cuvisterie Inox Sous Azote</p>
                          <p className="text-sm font-bold">Capacité de Stockage & Export Sécurisée</p>
                        </div>
                        <span className="rounded-full bg-emerald-500/20 px-2.5 py-1 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                          ACTIF
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= STATS SECTION ================= */}
        <section className="relative -mt-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-20">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div
                  key={i}
                  className="rounded-2xl bg-white p-6 shadow-premium border border-abh-border text-center card-hover"
                >
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-abh-sand/40 text-abh-sapphire mb-3">
                    <Icon className="h-6 w-6 text-abh-amber" />
                  </div>
                  <div className="text-3xl font-heading font-bold text-abh-sapphire mb-1">
                    {stat.value}
                  </div>
                  <div className="text-xs font-medium text-abh-slate">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ================= PRODUCTS PREVIEW ================= */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 rounded-full bg-abh-sand/50 px-3 py-1 text-xs font-semibold text-abh-sapphire mb-3">
              <Boxes className="h-3.5 w-3.5 text-abh-amber" />
              <span>Gamme Oléicole B2B</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-abh-sapphire">
              Nos Huiles d Olive & Bio Disponibles à l Export
            </h2>
            <p className="text-sm text-abh-slate mt-2">
              Chaque produit est soumis à une batterie d analyses physico-chimiques complètes avant scellage des conteneurs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {productsPreview.map((prod) => (
              <div
                key={prod.slug}
                className="group rounded-2xl bg-white overflow-hidden border border-abh-border shadow-card card-hover flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[4/3] overflow-hidden bg-abh-pearl">
                    <Image
                      src={prod.image}
                      alt={prod.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 rounded-full bg-abh-midnight/80 backdrop-blur-md px-3 py-1 text-[11px] font-semibold text-abh-amber border border-white/20">
                      {prod.badge}
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center justify-between text-xs text-abh-slate mb-1">
                      <span>Acidité Max :</span>
                      <span className="font-mono font-bold text-abh-sapphire">{prod.acidity}</span>
                    </div>
                    <h3 className="text-lg font-heading font-bold text-abh-sapphire mb-2 group-hover:text-abh-amber transition-colors">
                      {prod.title}
                    </h3>
                    <p className="text-xs text-abh-slate leading-relaxed mb-4">
                      {prod.desc}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <Link
                    href={`/products/${prod.slug}`}
                    className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl border border-abh-border py-2 text-xs font-semibold text-abh-sapphire hover:bg-abh-sapphire hover:text-white transition-colors"
                  >
                    <span>Consulter la Fiche Technique</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-sm font-semibold text-abh-amber hover:text-abh-copper transition-colors"
            >
              <span>Voir l ensemble des spécifications physico-chimiques</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* ================= WHY CHOOSE ABH ================= */}
        <section className="py-20 bg-abh-midnight text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-5 space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-abh-amber border border-white/15">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Rigueur & Fiabilité</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-heading font-bold leading-tight">
                  Pourquoi les Négociants Internationaux Choisissent ABH ?
                </h2>
                <p className="text-sm text-gray-300 leading-relaxed">
                  L approvisionnement en vrac maritime exige une traçabilité sans faille, une inertage sous azote maîtrisé pour éviter toute oxydation et une gestion documentaire douanière irréprochable.
                </p>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-abh-amber text-abh-midnight font-bold text-xs mt-0.5">
                      ✓
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Préservation Sous Atmosphère Inerte</h4>
                      <p className="text-xs text-gray-400">Toutes nos cuves de stockage inox sont inertées à l azote alimentaire pour garantir une acidité et un indice de peroxyde stables jusqu à l embarquement.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-abh-amber text-abh-midnight font-bold text-xs mt-0.5">
                      ✓
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Accréditation Sanitaire Complète</h4>
                      <p className="text-xs text-gray-400">Émission immédiate de certificats EUR.1 (exonération douanière UE), certificats phytosanitaires et attestations COI officielles.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-abh-amber text-abh-midnight font-bold text-xs mt-0.5">
                      ✓
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Assise Juridique & Financière Transparente</h4>
                      <p className="text-xs text-gray-400">Société SARL enregistrée au Registre National des Entreprises (RNE 1956962P) à Bouhajla, garantissant une conformité fiscale totale.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-2xl bg-white/5 border border-white/10 p-6 backdrop-blur-md">
                  <Factory className="h-8 w-8 text-abh-amber mb-3" />
                  <h3 className="text-base font-bold text-white mb-1">Capacité Industrielle</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Installations de pointe avec pont-bascule certifié et quais de chargement dédiés aux camions-citernes et conteneurs Flexitank.
                  </p>
                </div>

                <div className="rounded-2xl bg-white/5 border border-white/10 p-6 backdrop-blur-md">
                  <Ship className="h-8 w-8 text-abh-amber mb-3" />
                  <h3 className="text-base font-bold text-white mb-1">Proximité des Ports</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Accès rapide aux terminaux maritimes de Radès, Sousse et Bizerte avec des liaisons régulières vers l Europe, l Asie et les Amériques.
                  </p>
                </div>

                <div className="rounded-2xl bg-white/5 border border-white/10 p-6 backdrop-blur-md">
                  <FileCheck2 className="h-8 w-8 text-abh-amber mb-3" />
                  <h3 className="text-base font-bold text-white mb-1">Analyses Certifiées</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Double vérification analytique par laboratoire accrédité indépendant avant chaque chargement maritime.
                  </p>
                </div>

                <div className="rounded-2xl bg-white/5 border border-white/10 p-6 backdrop-blur-md">
                  <Award className="h-8 w-8 text-abh-amber mb-3" />
                  <h3 className="text-base font-bold text-white mb-1">Labels de Confiance</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Production certifiée BRC Food, ISO 22000, IFS Food, Agriculture Biologique (Ecocert), Halal et Kosher.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= PACKAGING SECTION ================= */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 rounded-full bg-abh-sand/50 px-3 py-1 text-xs font-semibold text-abh-sapphire mb-3">
              <Boxes className="h-3.5 w-3.5 text-abh-amber" />
              <span>Logistique de Conditionnement</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-abh-sapphire">
              Formats de Conditionnement Vrac
            </h2>
            <p className="text-sm text-abh-slate mt-2">
              Des solutions d emballage sécurisées et agréées contact alimentaire adaptées à vos impératifs de manutention.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {packagings.map((pkg, i) => (
              <div
                key={i}
                className="rounded-2xl bg-white p-6 border border-abh-border shadow-card card-hover flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-video rounded-xl overflow-hidden mb-4 bg-abh-pearl">
                    <Image
                      src={pkg.image}
                      alt={pkg.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="text-xs font-bold text-abh-amber uppercase tracking-wider mb-1">
                    {pkg.capacity}
                  </div>
                  <h3 className="text-base font-heading font-bold text-abh-sapphire mb-2">
                    {pkg.title}
                  </h3>
                  <p className="text-xs text-abh-slate leading-relaxed mb-4">
                    {pkg.desc}
                  </p>
                </div>
                <div className="pt-3 border-t border-abh-border/60 text-[11px] text-abh-slate">
                  <span className="font-semibold text-abh-sapphire">Idéal pour : </span>
                  {pkg.ideal}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================= FAQ SECTION ================= */}
        <section className="py-20 bg-abh-pearl/60 border-t border-abh-border">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-heading font-bold text-abh-sapphire">
                Questions Fréquentes (Export B2B)
              </h2>
              <p className="text-xs sm:text-sm text-abh-slate mt-1">
                Toutes les réponses pour faciliter votre premier approvisionnement auprès d ABH Company.
              </p>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div
                    key={index}
                    className="rounded-xl bg-white border border-abh-border overflow-hidden shadow-xs transition-all"
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(index)}
                      className="w-full flex items-center justify-between p-4 sm:p-5 text-left text-xs sm:text-sm font-bold text-abh-sapphire hover:text-abh-amber transition-colors"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`h-4 w-4 shrink-0 transition-transform duration-200 text-abh-amber ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-5 sm:px-5 text-xs text-abh-slate leading-relaxed border-t border-gray-100 pt-3">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ================= CTA BANNER ================= */}
        <section className="relative overflow-hidden bg-gradient-to-r from-abh-sapphire via-abh-midnight to-abh-sapphire py-16 text-white text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-abh-amber/20 px-3.5 py-1 text-xs font-semibold text-abh-amber border border-abh-amber/30">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Campagne Oléicole 2025 / 2026</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold">
              Prêt à Réserver vos Volumes d Huile d Olive Tunisienne ?
            </h2>
            <p className="text-sm text-gray-300 max-w-xl mx-auto font-light">
              Contactez directement notre direction commerciale pour recevoir nos cotations Incoterms actualisées et convenir d un calendrier d expéditions.
            </p>
            <div>
              <button
                type="button"
                onClick={() => setQuoteModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-abh-amber to-abh-copper px-8 py-3.5 text-sm font-bold text-white shadow-xl hover:scale-105 transition-all"
              >
                <span>Solliciter une Cotation Immédiate</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <QuoteModal isOpen={quoteModalOpen} onClose={() => setQuoteModalOpen(false)} />
    </>
  );
}
