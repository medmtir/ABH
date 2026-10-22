'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Certification } from '@/lib/types';
import { ShieldCheck, Award, Sparkles, CheckCircle2, FileText } from 'lucide-react';

export default function CertificationsPage() {
  const [certs, setCerts] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/certifications')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCerts(data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Header />

      <main className="min-h-screen pt-28 pb-24 bg-abh-pearl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 rounded-full bg-abh-sand/60 px-3.5 py-1 text-xs font-semibold text-abh-sapphire mb-3">
              <Award className="h-3.5 w-3.5 text-abh-amber" />
              <span>Systèmes de Management & Conformité</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-heading font-bold text-abh-sapphire">
              Normes & Certifications Internationales
            </h1>
            <p className="text-sm sm:text-base text-abh-slate mt-3 leading-relaxed">
              Toutes nos huiles d olive et installations industrielles font l objet d audits réguliers par des organismes certificateurs indépendants pour garantir une conformité totale aux exigences sanitaires mondiales.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-48 rounded-2xl bg-abh-sand/30 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certs.map((cert) => {
                const trans = cert.translations?.fr || Object.values(cert.translations || {})[0] || {};
                return (
                  <div
                    key={cert.id}
                    className="rounded-2xl bg-white p-6 border border-abh-border shadow-card card-hover flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="relative h-14 w-20 shrink-0">
                          <Image
                            src={cert.logo}
                            alt={trans.name}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>Certifié Conforme</span>
                        </span>
                      </div>

                      <h3 className="text-base font-heading font-bold text-abh-sapphire mb-1">
                        {trans.name}
                      </h3>
                      <p className="text-[11px] font-semibold text-abh-copper mb-2">
                        {trans.issuer}
                      </p>
                      <p className="text-xs text-abh-slate leading-relaxed">
                        {trans.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-abh-slate">
                      <span>Audit & Contrôle Périodique</span>
                      <span className="font-semibold text-abh-sapphire">Validé</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* COI Compliance Box */}
          <div className="mt-16 rounded-2xl bg-gradient-to-r from-abh-sapphire to-abh-midnight p-8 text-white">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-8 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-abh-amber">Conseil Oléicole International (COI)</span>
                <h3 className="text-2xl font-heading font-bold">
                  Conformité Stricte aux Standards Physico-Chimiques & Organoleptiques
                </h3>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-light">
                  Chaque lot destiné au vrac maritime est testé selon la norme commerciale applicable aux huiles d olive et aux huiles de grignons d olive (COI/T.15/NC n° 3). Un certificat d analyse complet délivré par un laboratoire agréé par le COI accompagne systématiquement chaque connaissement maritime (Bill of Lading).
                </p>
              </div>
              <div className="md:col-span-4 flex justify-center md:justify-end">
                <div className="rounded-xl bg-white/10 backdrop-blur-md p-4 border border-white/20 text-center">
                  <ShieldCheck className="h-10 w-10 text-abh-amber mx-auto mb-2" />
                  <span className="text-xs font-bold block">Accréditation Laboratoire</span>
                  <span className="text-[10px] text-gray-300">100% des lots analysés</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
