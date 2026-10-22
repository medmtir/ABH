'use client';

import React, { useState } from 'react';
import { Lock, Save, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';

export default function AdminSettingsPage() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
          Sécurité & Paramètres du Compte Administrateur
        </h1>
        <p className="text-xs text-abh-slate mt-0.5">
          Modifiez votre mot de passe d accès et vérifiez les paramètres de sécurité de la plateforme.
        </p>
      </div>

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
