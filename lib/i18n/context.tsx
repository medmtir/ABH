'use client';

// ============================================================
// ABH Company — Public Site i18n Context Provider
// ============================================================

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';
import type { Locale } from '@/lib/types';
import { defaultLocale, getDirection, isValidLocale } from '@/lib/i18n/config';
import { getDictionary, type Dictionary } from '@/lib/i18n/dictionaries';

interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  dir: 'ltr' | 'rtl';
  dictionary: Dictionary;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

interface LanguageProviderProps {
  children: ReactNode;
  initialLocale?: Locale;
}

export function LanguageProvider({
  children,
  initialLocale = defaultLocale,
}: LanguageProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('abh-locale') as Locale | null;
      if (saved && isValidLocale(saved)) {
        setLocaleState(saved);
        document.documentElement.lang = saved;
        document.documentElement.dir = getDirection(saved);
      } else {
        setLocaleState('en');
        localStorage.setItem('abh-locale', 'en');
        document.documentElement.lang = 'en';
        document.documentElement.dir = 'ltr';
      }
    }
  }, []);

  const dictionary = useMemo(() => getDictionary(locale), [locale]);
  const dir = useMemo(() => getDirection(locale), [locale]);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    // Persist preference
    if (typeof window !== 'undefined') {
      localStorage.setItem('abh-locale', newLocale);
      document.documentElement.lang = newLocale;
      document.documentElement.dir = getDirection(newLocale);
    }
  }, []);

  /**
   * Translate a key using dot notation, e.g. t('nav.home')
   * Falls back to the key itself if not found.
   */
  const t = useCallback(
    (key: string): string => {
      const keys = key.split('.');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let value: any = dictionary;

      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = value[k];
        } else {
          return key; // Return key as fallback
        }
      }

      return typeof value === 'string' ? value : key;
    },
    [dictionary]
  );

  const contextValue = useMemo<LanguageContextValue>(
    () => ({ locale, setLocale, t, dir, dictionary }),
    [locale, setLocale, t, dir, dictionary]
  );

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

/**
 * Hook to access the current locale, translation function, and direction.
 * Must be used inside a LanguageProvider.
 */
export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return ctx;
}
