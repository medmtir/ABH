'use client';

import React, { useState, useEffect } from 'react';
import { Smartphone, Download, X, CheckCircle, Share, PlusSquare } from 'lucide-react';

interface PwaInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PwaInstallModal({ isOpen, onClose }: PwaInstallModalProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if running as PWA
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsStandalone(true);
    }

    // Check iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(userAgent));

    // Listen for beforeinstallprompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-abh-midnight/80 backdrop-blur-sm animate-fade-in-up">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-abh-border">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1.5 text-gray-400 hover:bg-abh-pearl hover:text-abh-sapphire transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="text-center mb-6">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-abh-sand/50 text-abh-sapphire mb-3 ring-8 ring-abh-sand/20">
            <Smartphone className="h-7 w-7 text-abh-amber" />
          </div>
          <h3 className="text-lg font-heading font-bold text-abh-sapphire">
            Installer l Application ABH Admin
          </h3>
          <p className="text-xs text-abh-slate mt-1">
            Gérez vos commandes B2B, devis et expéditions maritimes directement depuis votre smartphone.
          </p>
        </div>

        {isStandalone ? (
          <div className="rounded-xl bg-emerald-50 p-4 text-center border border-emerald-200">
            <CheckCircle className="h-6 w-6 text-emerald-600 mx-auto mb-1" />
            <p className="text-xs font-semibold text-emerald-800">
              Application déjà installée en mode natif !
            </p>
          </div>
        ) : isIOS ? (
          <div className="rounded-xl bg-abh-pearl/70 p-4 border border-abh-border text-xs space-y-3">
            <p className="font-semibold text-abh-sapphire">Procédure sur iPhone & iPad (Safari) :</p>
            <div className="flex items-center gap-3 text-abh-midnight">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-abh-sapphire text-white text-[10px] font-bold">1</span>
              <span className="flex items-center gap-1.5">
                Touchez l icône <Share className="h-4 w-4 text-abh-sapphire inline" /> (Partager)
              </span>
            </div>
            <div className="flex items-center gap-3 text-abh-midnight">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-abh-sapphire text-white text-[10px] font-bold">2</span>
              <span className="flex items-center gap-1.5">
                Sélectionnez <PlusSquare className="h-4 w-4 text-gray-700 inline" /> <b>Sur l écran d accueil</b>
              </span>
            </div>
            <div className="flex items-center gap-3 text-abh-midnight">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-abh-sapphire text-white text-[10px] font-bold">3</span>
              <span>Touchez <b>Ajouter</b> en haut à droite</span>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <button
              onClick={handleInstallClick}
              disabled={!deferredPrompt}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-abh-sapphire to-abh-midnight py-3 px-4 text-xs font-semibold text-white shadow-md hover:from-abh-midnight hover:to-abh-sapphire transition-all disabled:opacity-50"
            >
              <Download className="h-4 w-4 text-abh-amber" />
              <span>{deferredPrompt ? 'Installer sur cet appareil' : 'Installation prête (Chrome/Android)'}</span>
            </button>
            <p className="text-[11px] text-center text-abh-slate">
              Fonctionne hors-ligne et permet de recevoir les notifications d alertes instantanées.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default PwaInstallModal;
