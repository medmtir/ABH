'use client';

// ============================================================
// ABH Company — Site Settings Context Provider
// ============================================================

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  type ReactNode,
} from 'react';
import type { SiteSettings } from '@/lib/types';

interface SiteSettingsContextValue {
  settings: SiteSettings | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const SiteSettingsContext = createContext<SiteSettingsContextValue | null>(null);

interface SiteSettingsProviderProps {
  children: ReactNode;
  /** Optional pre-fetched settings (for SSR hydration). */
  initialSettings?: SiteSettings | null;
}

export function SiteSettingsProvider({
  children,
  initialSettings = null,
}: SiteSettingsProviderProps) {
  const [settings, setSettings] = useState<SiteSettings | null>(initialSettings);
  const [loading, setLoading] = useState(!initialSettings);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/site-settings');

      if (!response.ok) {
        throw new Error(`Failed to fetch site settings: ${response.status}`);
      }

      const data = await response.json();
      setSettings(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load site settings';
      setError(message);
      console.error('[ABH SiteSettings]', message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!initialSettings) {
      fetchSettings();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const contextValue = useMemo<SiteSettingsContextValue>(
    () => ({
      settings,
      loading,
      error,
      refetch: fetchSettings,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [settings, loading, error]
  );

  return (
    <SiteSettingsContext.Provider value={contextValue}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

/**
 * Hook to access site settings from the context.
 * Must be used inside a SiteSettingsProvider.
 */
export function useSiteSettings(): SiteSettingsContextValue {
  const ctx = useContext(SiteSettingsContext);
  if (!ctx) {
    throw new Error('useSiteSettings must be used within a SiteSettingsProvider');
  }
  return ctx;
}
