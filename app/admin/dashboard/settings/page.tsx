'use client';

import React, { useState, useEffect } from 'react';
import { Lock, Save, CheckCircle2, AlertCircle, ShieldCheck, Bell, BellRing, Smartphone, Laptop, Volume2, Sparkles } from 'lucide-react';

export default function AdminSettingsPage() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Notifications state
  const [notifPermission, setNotifPermission] = useState<'default' | 'granted' | 'denied' | 'unsupported'>('default');
  const [notifTesting, setNotifTesting] = useState(false);
  const [notifMsg, setNotifMsg] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (!('Notification' in window)) {
        setNotifPermission('unsupported');
      } else {
        setNotifPermission(Notification.permission);
      }
    }
  }, []);

  const requestNotifPermission = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      alert("Votre navigateur ne supporte pas l'API Notification native.");
      return;
    }
    try {
      const res = await Notification.requestPermission();
      setNotifPermission(res);
      if (res === 'granted') {
        setNotifMsg('✅ Autorisation accordée ! Vous recevrez des alertes.');
      } else if (res === 'denied') {
        setNotifMsg('⚠️ Notifications bloquées. Veuillez les autoriser dans les paramètres de votre navigateur.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const playChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, now);
      gain1.gain.setValueAtTime(0.3, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.25);

      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(880.0, now + 0.15);
      gain2.gain.setValueAtTime(0.35, now + 0.15);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.15);
      osc2.stop(now + 0.55);
    } catch (e) {
      console.error(e);
    }
  };

  const triggerTestNotification = async () => {
    setNotifTesting(true);
    playChime();

    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([250, 100, 250]);
      } catch (e) {}
    }

    if (typeof window !== 'undefined' && 'Notification' in window) {
      let perm = Notification.permission;
      if (perm === 'default') {
        perm = await Notification.requestPermission();
        setNotifPermission(perm);
      }

      if (perm === 'granted') {
        const title = '🔔 ABH Devis & Commandes - Test';
        const options: any = {
          body: 'Test d alerte réussi ! Vous serez averti en direct à chaque nouveau devis ou commande.',
          icon: '/images/logo.png',
          badge: '/images/logo.png',
          tag: 'abh-test-' + Date.now(),
        };

        if ('serviceWorker' in navigator) {
          try {
            const reg = await navigator.serviceWorker.ready;
            await (reg as any).showNotification(title, options);
          } catch (e) {
            new Notification(title, options);
          }
        } else {
          new Notification(title, options);
        }
      }
    }

    setNotifMsg('🔔 Notification de test envoyée ! (Son + vibration + alerte système)');
    setTimeout(() => {
      setNotifTesting(false);
    }, 1500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (newPassword !== confirmPassword) {
      setError('Les deux nouveaux mots de passe ne correspondent pas.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Le mot de passe doit comporter au moins 6 caractères.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors du changement de mot de passe');
      }

      setSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.message || 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-heading font-bold text-abh-sapphire">
          Paramètres du Compte & Alertes Directes
        </h1>
        <p className="text-xs text-abh-slate mt-0.5">
          Gérez vos notifications instantanées sur smartphone et PC, et sécurisez votre accès administrateur.
        </p>
      </div>

      {/* Notifications Card */}
      <div className="rounded-2xl bg-white p-6 sm:p-8 border border-abh-border shadow-xs space-y-5 text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-abh-amber/15 text-abh-amber border border-abh-amber/30">
              <BellRing className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-heading font-bold text-abh-sapphire">
                Notifications en Direct (PC & Smartphone)
              </h2>
              <p className="text-abh-slate text-[11px]">
                Son d'alerte, vibration mobile et bannières système lors de la réception d'un nouveau devis ou d'une commande.
              </p>
            </div>
          </div>
          <span
            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
              notifPermission === 'granted'
                ? 'bg-emerald-100 text-emerald-800'
                : notifPermission === 'denied'
                ? 'bg-red-100 text-red-800'
                : 'bg-amber-100 text-amber-800'
            }`}
          >
            {notifPermission === 'granted'
              ? 'Activé'
              : notifPermission === 'denied'
              ? 'Bloqué'
              : notifPermission === 'unsupported'
              ? 'Non supporté'
              : 'En attente'}
          </span>
        </div>

        {notifMsg && (
          <div className="p-3 rounded-xl bg-abh-sand/40 border border-abh-border text-abh-sapphire font-medium">
            {notifMsg}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="p-3 rounded-xl bg-abh-pearl/50 border border-abh-border/80 flex items-start gap-2.5">
            <Smartphone className="h-4 w-4 text-abh-amber shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-abh-sapphire text-[11px]">Sur iPhone & Android</p>
              <p className="text-[10px] text-abh-slate mt-0.5 leading-relaxed">
                Sur iPhone : Safari &rarr; Partager &rarr; <b>Sur l'écran d'accueil</b>. Ouvrez ensuite l'application depuis votre écran et autorisez les alertes.
              </p>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-abh-pearl/50 border border-abh-border/80 flex items-start gap-2.5">
            <Laptop className="h-4 w-4 text-abh-amber shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-abh-sapphire text-[11px]">Sur Ordinateur (PC / Mac)</p>
              <p className="text-[10px] text-abh-slate mt-0.5 leading-relaxed">
                Laissez l'onglet ouvert en arrière-plan. Une sonnerie et une bannière Windows / Mac s'affichent automatiquement à chaque devis.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-abh-border/60">
          {notifPermission !== 'granted' && (
            <button
              type="button"
              onClick={requestNotifPermission}
              className="inline-flex items-center gap-2 rounded-xl bg-abh-amber px-4 py-2 font-semibold text-abh-midnight hover:bg-abh-amber-hover transition-colors shadow-xs"
            >
              <Bell className="h-3.5 w-3.5" />
              <span>Activer les Notifications</span>
            </button>
          )}

          <button
            type="button"
            onClick={triggerTestNotification}
            disabled={notifTesting}
            className="inline-flex items-center gap-2 rounded-xl border border-abh-border bg-white px-4 py-2 font-semibold text-abh-sapphire hover:bg-abh-sand/40 transition-colors shadow-2xs"
          >
            <Volume2 className="h-3.5 w-3.5 text-abh-amber" />
            <span>{notifTesting ? 'Sonnerie en cours...' : 'Tester le Son & Alerte'}</span>
          </button>
        </div>
      </div>

      {/* Password & Security Card */}
      <div className="rounded-2xl bg-white p-6 sm:p-8 border border-abh-border shadow-xs space-y-6 text-xs">
        <div className="flex items-center gap-3 rounded-xl bg-abh-sand/30 p-3.5 border border-abh-border">
          <ShieldCheck className="h-5 w-5 text-abh-amber shrink-0" />
          <p className="text-abh-sapphire leading-relaxed">
            Votre session est protégée par un jeton JWT avec signature cryptographique et hachage <b>Bcrypt à 12 tours de salage</b>.
          </p>
        </div>

        {success && (
          <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3.5 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>Votre mot de passe a été modifié avec succès !</span>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3.5 text-red-700 border border-red-200">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold text-abh-midnight mb-1.5">
              Mot de Passe Actuel *
            </label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full rounded-xl border border-abh-border p-2.5 focus:outline-none focus:border-abh-amber bg-abh-pearl/40"
              placeholder="••••••••••••"
            />
          </div>

          <div>
            <label className="block font-semibold text-abh-midnight mb-1.5">
              Nouveau Mot de Passe *
            </label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded-xl border border-abh-border p-2.5 focus:outline-none focus:border-abh-amber bg-abh-pearl/40"
              placeholder="••••••••••••"
            />
          </div>

          <div>
            <label className="block font-semibold text-abh-midnight mb-1.5">
              Confirmer le Nouveau Mot de Passe *
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-xl border border-abh-border p-2.5 focus:outline-none focus:border-abh-amber bg-abh-pearl/40"
              placeholder="••••••••••••"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-abh-sapphire px-6 py-2.5 font-semibold text-white shadow-xs hover:bg-abh-midnight transition-colors disabled:opacity-50"
            >
              {loading ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <Save className="h-4 w-4 text-abh-amber" />
                  <span>Mettre à Jour le Mot de Passe</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
