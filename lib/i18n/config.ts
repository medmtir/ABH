// ============================================================
// ABH Company — Locale Configuration
// ============================================================

import type { Locale, LocaleConfig } from '@/lib/types';

export const locales: LocaleConfig[] = [
  { code: 'fr', name: 'Français',  flag: '🇫🇷', dir: 'ltr' },
  { code: 'en', name: 'English',   flag: '🇬🇧', dir: 'ltr' },
  { code: 'ar', name: 'العربية',   flag: '🇹🇳', dir: 'rtl' },
  { code: 'es', name: 'Español',   flag: '🇪🇸', dir: 'ltr' },
  { code: 'it', name: 'Italiano',  flag: '🇮🇹', dir: 'ltr' },
];

export const defaultLocale: Locale = 'en';

export const localeCodes = locales.map((l) => l.code);

export function getLocaleConfig(code: Locale): LocaleConfig {
  return locales.find((l) => l.code === code) ?? locales[0];
}

export function isValidLocale(code: string): code is Locale {
  return localeCodes.includes(code as Locale);
}

/**
 * Flag image URL from flagcdn.com for a given country code.
 * Maps locale codes to ISO 3166-1 alpha-2 country codes.
 */
export function getFlagUrl(locale: Locale, size: 'w20' | 'w40' | 'w80' = 'w40'): string {
  const countryMap: Record<Locale, string> = {
    fr: 'fr',
    en: 'gb',
    ar: 'tn',
    es: 'es',
    it: 'it',
  };
  return `https://flagcdn.com/${size}/${countryMap[locale]}.png`;
}

export function getDirection(locale: Locale): 'ltr' | 'rtl' {
  return locale === 'ar' ? 'rtl' : 'ltr';
}
