'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { QuoteModal } from '@/components/ui/QuoteModal';
import {
  Ship,
  Sparkles,
  ArrowRight,
  Anchor,
  FileCheck,
  CheckCircle2,
  Clock,
  Compass,
  Boxes,
  ShieldCheck,
} from 'lucide-react';

export default function ExportPage() {
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);

  const steps = [
    {
      num: '01',
      title: 'Consultation & Cahier des Charges',
      desc: 'Réception de votre demande de cotation (RFQ) : choix de la catégorie d huile, acidité cible, volume et conditionnement souhaité.',
    },
    {
      num: '02',
      title: 'Échantillonnage & Validation Labo',
      desc: 'Expédition par courrier express (DHL/FedEx) d échantillons scellés de 250ml ou 500ml accompagnés du bulletin d analyse COI.',
    },
    {
      num: '03',
      title: 'Offre Commerciale & Incoterms',
      desc: 'Établissement du contrat proforma selon l Incoterm retenu : FOB (ports tunisiens), CFR ou CIF (port acheteur). Fixation des garanties bancaires (L/C ou SWIFT).',
    },
    {
      num: '04',
      title: 'Conditionnement & Inertage Azote',
      desc: 'Pompage et filtration de l huile dans les Flexitanks monocouches ou cuves IBC sous atmosphère protectrice d azote pour bloquer l oxydation.',
    },
    {
      num: '05',
      title: 'Certification Douanière & Sanitaire',
      desc: 'Émission des documents officiels : certificat de circulation EUR.1 (exonération droits UE), certificat phytosanitaire et connaissement maritime (B/L).',
    },
    {
      num: '06',
      title: 'Expédition Maritime & Suivi B/L',
      desc: 'Mise à bord sur navire porte-conteneurs au départ de Radès, Sousse ou Bizerte avec transmission immédiate des références de tracking.',
    },
  ];

  const ports = [
    {
      name: 'Port de Radès (Tunis)',
      type: 'Terminal Conteneurs Principal',
      destinations: 'Liaisons régulières vers Marseille, Gênes, Valence, Rotterdam, New York, Asie.',
      leadTime: '3 à 5 jours vers la Méditerranée occidentale',
    },
    {
      name: 'Port de Sousse',
      type: 'Terminal Polyvalent Proche Kairouan',
      destinations: 'Liaisons maritimes courtes et vrac liquide vers l Europe du Sud.',
      leadTime: 'Proximité immédiate de nos installations de Bouhajla',
    },
    {
      name: 'Port de Bizerte',
      type: 'Terminal Eaux Profondes',
      destinations: 'Adapté aux navires gros porteurs et expéditions transatlantiques.',
      leadTime: 'Position stratégique sur le détroit de Sicile',
    },
  ];

  return (
    <>
      <Header />

      <main className="min-h-screen pt-28 pb-24 bg-abh-pearl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 rounded-full bg-abh-sand/60 px-3.5 py-1 text-xs font-semibold text-abh-sapphire mb-3">
              <Ship className="h-3.5 w-3.5 text-abh-amber" />
              <span>Chaîne Logistique Maritime B2B</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-heading font-bold text-abh-sapphire">
              Exportation Mondiale & Fret Maritime
            </h1>
            <p className="text-sm sm:text-base text-abh-slate mt-3 leading-relaxed">
              Une organisation logistique rodée pour acheminer vos commandes d huile d olive tunisienne en toute sécurité thermique et sanitaire, du terminal de départ jusqu à votre port de déchargement.
            </p>
          </div>

          {/* Hero Banner with Port Containers image */}
          <div className="relative rounded-2xl overflow-hidden shadow-premium border border-abh-border mb-20 bg-abh-midnight text-white">
            <div className="relative aspect-[21/9] sm:aspect-[24/9] w-full">
              <Image
                src="/images/facility/port-containers.jpg"
                alt="Terminaux portuaires de Radès et Sousse"
                fill
                className="object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-abh-midnight via-abh-midnight/70 to-transparent" />
              <div className="absolute inset-0 flex items-center p-6 sm:p-12">
                <div className="max-w-xl space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-abh-amber">
                    Flexitanks de 24 000 Litres
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-heading font-bold">
                    La Solution Logistique la Plus Économique pour l Industrie
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-300 font-light">
                    Chargement direct en usine, réduction drastique des coûts d emballage et sécurité totale contre les risques de contamination croisée.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 6 Steps Timeline */}
          <div className="mb-20">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-3xl font-heading font-bold text-abh-sapphire">
                Le Processus d Exportation en 6 Étapes
              </h2>
              <p className="text-xs sm:text-sm text-abh-slate mt-1">
                De la première prise de contact jusqu à la livraison de vos connaissements maritimes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {steps.map((st) => (
                <div
                  key={st.num}
                  className="rounded-2xl bg-white p-6 border border-abh-border shadow-xs card-hover flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-heading font-bold text-2xl text-abh-amber">
                        {st.num}
                      </span>
                      <span className="h-2 w-2 rounded-full bg-abh-sapphire" />
                    </div>
                    <h3 className="text-base font-heading font-bold text-abh-sapphire mb-2">
                      {st.title}
                    </h3>
                    <p className="text-xs text-abh-slate leading-relaxed">
                      {st.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ports of Departure */}
          <div className="mb-20">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-3xl font-heading font-bold text-abh-sapphire">
                Nos Ports d Embarquement en Tunisie
              </h2>
              <p className="text-xs sm:text-sm text-abh-slate mt-1">
                Connexion directe avec les principales lignes de transport maritime conteneurisé.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {ports.map((pt, i) => (
                <div
                  key={i}
                  className="rounded-2xl bg-white p-6 border border-abh-border shadow-card card-hover"
                >
                  <Anchor className="h-6 w-6 text-abh-amber mb-3" />
                  <h3 className="text-base font-heading font-bold text-abh-sapphire mb-1">
                    {pt.name}
                  </h3>
                  <span className="text-[11px] font-semibold text-abh-copper block mb-3">
                    {pt.type}
                  </span>
                  <p className="text-xs text-abh-slate mb-4 leading-relaxed">
                    {pt.destinations}
                  </p>
                  <div className="pt-3 border-t border-gray-100 text-[11px] text-abh-slate flex items-center gap-1.5">
                    <Clock className="h-3 w-3 text-abh-amber shrink-0" />
                    <span>{pt.leadTime}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Incoterms & Documentation Box */}
          <div className="rounded-2xl bg-white p-8 border border-abh-border shadow-premium mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-heading font-bold text-abh-sapphire mb-3 flex items-center gap-2">
                  <Compass className="h-5 w-5 text-abh-amber" />
                  <span>Incoterms Maritimes Maîtrisés</span>
                </h3>
                <div className="space-y-3 text-xs text-abh-slate">
                  <div className="p-3 rounded-xl bg-abh-pearl/40 border border-abh-border/50">
                    <b className="text-abh-sapphire block mb-0.5">FOB (Free on Board) :</b>
                    Mise à bord effectuée et dédouanement export pris en charge au port tunisien de votre choix (Radès, Sousse, Bizerte).
                  </div>
                  <div className="p-3 rounded-xl bg-abh-pearl/40 border border-abh-border/50">
                    <b className="text-abh-sapphire block mb-0.5">CFR (Cost and Freight) :</b>
                    Fret maritime payé par ABH jusqu à votre port de débarquement convenu.
                  </div>
                  <div className="p-3 rounded-xl bg-abh-pearl/40 border border-abh-border/50">
                    <b className="text-abh-sapphire block mb-0.5">CIF (Cost, Insurance & Freight) :</b>
                    Fret maritime et police d assurance tous risques maritime souscrite à nos frais au profit de l acheteur.
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-heading font-bold text-abh-sapphire mb-3 flex items-center gap-2">
                  <FileCheck className="h-5 w-5 text-abh-amber" />
                  <span>Dossier Sanitaire & Douanier Export</span>
                </h3>
                <ul className="space-y-2 text-xs text-abh-slate">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><b>Certificat EUR.1 :</b> Accorde l exonération totale des droits de douane pour l Union Européenne dans le cadre de l accord d association.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><b>Certificat Phytosanitaire Officiel :</b> Délivré par le Ministère de l Agriculture tunisien.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><b>Certificat d Analyse COI :</b> Bulletin délivré par un laboratoire agréé par le Conseil Oléicole International.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><b>Certificat d Origine & Connaissement (B/L) :</b> 3 originaux émis par la compagnie maritime.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => setQuoteModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-abh-amber to-abh-copper px-8 py-3.5 text-sm font-bold text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              <span>Demander une Cotation de Fret Maritime</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </main>

      <Footer />

      <QuoteModal isOpen={quoteModalOpen} onClose={() => setQuoteModalOpen(false)} />
    </>
  );
}
