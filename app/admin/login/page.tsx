'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ABHLogo } from '@/components/ui/ABHLogo';
import { Lock, Mail, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Identifiants incorrects');
      }

      router.push('/admin/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-abh-midnight via-[#132238] to-abh-sapphire p-4 sm:p-6">
      <div className="w-full max-w-md">
        {/* Logo container */}
        <div className="text-center mb-8">
          <div className="inline-block p-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 mb-4 shadow-xl">
            <ABHLogo variant="dark" size="lg" />
          </div>
          <h1 className="text-2xl font-heading font-bold text-white tracking-wide">
            Espace Direction & Gestion Commerciale
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Authentic Bio Huile Company — Centre de Pilotage Sécurisé
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-white/95 backdrop-blur-xl p-8 shadow-2xl border border-white/20">
          <div className="flex items-center gap-2 rounded-xl bg-abh-sand/40 p-3 text-xs text-abh-sapphire mb-6 border border-abh-border">
            <ShieldCheck className="h-4 w-4 text-abh-amber shrink-0" />
            <span>Session chiffrée SSL / Protection anti-brute-force active</span>
          </div>

          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs text-red-700 border border-red-200">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-abh-midnight mb-1.5">
                Identifiant Administrateur (Email)
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-abh-border bg-abh-pearl/40 pl-10 pr-3.5 py-2.5 text-xs sm:text-sm focus:border-abh-amber focus:bg-white focus:outline-none transition-colors"
                  placeholder="admin@abh-company.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-abh-midnight mb-1.5">
                Mot de Passe Sécurisé
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-abh-border bg-abh-pearl/40 pl-10 pr-3.5 py-2.5 text-xs sm:text-sm focus:border-abh-amber focus:bg-white focus:outline-none transition-colors"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-abh-sapphire to-abh-midnight py-3 px-4 text-xs sm:text-sm font-semibold text-white shadow-lg hover:from-abh-midnight hover:to-abh-sapphire transition-all disabled:opacity-50"
              >
                {loading ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <span>Accéder au Tableau de Bord</span>
                    <ArrowRight className="h-4 w-4 text-abh-amber" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-4 border-t border-gray-100 text-center">
            <Link
              href="/"
              className="text-xs text-abh-slate hover:text-abh-sapphire transition-colors"
            >
              ← Retour au site public ABH
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
