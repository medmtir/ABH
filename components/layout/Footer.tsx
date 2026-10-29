'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ABHLogo } from '@/components/ui/ABHLogo';
import { MapPin, Phone, Mail, ShieldCheck, Award, ArrowRight, ExternalLink } from 'lucide-react';
import { useSiteSettings } from '@/lib/context/site-settings-context';

export function Footer() {
  const { settings } = useSiteSettings();

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-abh-midnight text-gray-300 border-t border-white/10 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Col 1: About & Identification */}
          <div className="space-y-4">
            <ABHLogo variant="dark" size="md" />
            <p className="text-xs text-gray-400 leading-relaxed">
              Société de commerce international spécialisée dans la sélection, le conditionnement vrac et l exportation maritime d huiles d olive tunisiennes extra vierges et biologiques certifiées.
            </p>
            <div className="rounded-xl bg-white/5 p-3 border border-white/10 text-[11px] space-y-1 text-gray-300">
              <div className="flex justify-between">
                <span className="text-gray-400">RNE Unique :</span>
                <span className="font-mono text-abh-amber font-semibold">1956962P</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Gérance :</span>
                <span>بديع عماري (Badi Ammari)</span>
              </div>
            </div>
          </div>

          {/* Col 2: Navigation Rapide */}
          <div>
            <h4 className="text-sm font-heading font-semibold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-abh-amber"></span>
              Navigation Rapide
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/" className="hover:text-abh-amber transition-colors flex items-center gap-1.5">
                  <ArrowRight className="h-3 w-3 text-abh-amber/70" />
                  <span>Accueil</span>
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-abh-amber transition-colors flex items-center gap-1.5">
                  <ArrowRight className="h-3 w-3 text-abh-amber/70" />
                  <span>Catalogue Produits en Vrac</span>
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-abh-amber transition-colors flex items-center gap-1.5">
                  <ArrowRight className="h-3 w-3 text-abh-amber/70" />
                  <span>À Propos & Terroirs de Kairouan</span>
                </Link>
              </li>
              <li>
                <Link href="/certifications" className="hover:text-abh-amber transition-colors flex items-center gap-1.5">
                  <ArrowRight className="h-3 w-3 text-abh-amber/70" />
                  <span>Normes & Certifications (BRC, ISO, BIO)</span>
                </Link>
              </li>
              <li>
                <Link href="/export" className="hover:text-abh-amber transition-colors flex items-center gap-1.5">
                  <ArrowRight className="h-3 w-3 text-abh-amber/70" />
                  <span>Logistique Maritime & Flexitanks</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-abh-amber transition-colors flex items-center gap-1.5">
                  <ArrowRight className="h-3 w-3 text-abh-amber/70" />
                  <span>Contact & Demande de Cotation</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Gamme de Produits */}
          <div>
            <h4 className="text-sm font-heading font-semibold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-abh-amber"></span>
              Export Vrac Maritime
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li className="p-2 rounded-lg bg-white/5 border border-white/5">
                <span className="text-white font-medium block">Huile d Olive Vierge Extra</span>
                <span className="text-[10px] text-abh-amber">Acidité ≤ 0.8% • Chemlali & Chétoui</span>
              </li>
              <li className="p-2 rounded-lg bg-white/5 border border-white/5">
                <span className="text-white font-medium block">Huile d Olive Biologique Certifiée</span>
                <span className="text-[10px] text-abh-amber">Certifiée BIO UE & USDA • Acidité ≤ 0.5%</span>
              </li>
              <li className="p-2 rounded-lg bg-white/5 border border-white/5">
                <span className="text-white font-medium block">Huile d Olive Raffinée & Grignons</span>
                <span className="text-[10px] text-gray-400">Pour industries alimentaires & friture</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Siège & Contact */}
          <div>
            <h4 className="text-sm font-heading font-semibold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-abh-amber"></span>
              Siège Social & Contact
            </h4>
            <div className="space-y-3 text-xs text-gray-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-abh-amber shrink-0 mt-0.5" />
                <span>N°46, Rue Tahar Sfar, Bouhajla 3180, Kairouan, Tunisie</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-abh-amber shrink-0" />
                <span>+216 70 248 170 / +216 50 000 000</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-abh-amber shrink-0" />
                <span>contact@abh-company.com</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-3">
              <Link
                href="/admin/login"
                className="text-[11px] text-gray-400 hover:text-abh-amber transition-colors flex items-center gap-1"
              >
                <span>Accès Espace Direction (Admin)</span>
                <ExternalLink className="h-2.5 w-2.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Certifications strip */}
        <div className="py-6 border-y border-white/10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Award className="h-4 w-4 text-abh-amber" />
            <span>Accréditations & Systèmes Qualité Reconnus à l International :</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold text-gray-300">
            <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10">BRC FOOD</span>
            <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10">ISO 22000</span>
            <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10">IFS FOOD</span>
            <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-emerald-400">BIO UE / USDA</span>
            <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10">HALAL</span>
            <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10">KOSHER</span>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <div>
            © {currentYear} Authentic Bio Huile Company (ABH). Tous droits réservés.
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Conformité RNE Tunisie</span>
            <span>•</span>
            <span>Conseil Oléicole International (COI)</span>
            <span>•</span>
            <span className="text-abh-amber">ABH Digital Architecture</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
