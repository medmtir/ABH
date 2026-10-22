'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/lib/i18n/context';
import { locales, getFlagUrl } from '@/lib/i18n/config';
import type { Locale } from '@/lib/types';
import { ChevronDown, Globe } from 'lucide-react';

interface LanguageSelectorProps {
  variant?: 'light' | 'dark';
}

export function LanguageSelector({ variant = 'light' }: LanguageSelectorProps) {
  const { locale, setLocale } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentConfig = locales.find((l) => l.code === locale) || locales[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isDark = variant === 'dark';

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold tracking-wider uppercase transition-all duration-200 border ${
          isDark
            ? 'border-white/10 bg-white/5 text-gray-200 hover:bg-white/10 hover:border-abh-amber'
            : 'border-abh-border bg-white/80 text-abh-sapphire hover:border-abh-amber hover:bg-white shadow-sm'
        }`}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <img
          src={getFlagUrl(currentConfig.code, 'w20')}
          alt={currentConfig.name}
          className="h-3 w-4 rounded-sm object-cover shadow-xs"
        />
        <span>{currentConfig.code.toUpperCase()}</span>
        <ChevronDown
          className={`h-3 w-3 transition-transform duration-200 ${isOpen ? 'rotate-180 text-abh-amber' : ''}`}
        />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-44 origin-top-right rounded-xl bg-white p-1.5 shadow-xl ring-1 ring-black/5 border border-abh-border z-50 animate-scale-in"
          role="menu"
        >
          <div className="px-2 py-1 text-[11px] font-medium text-abh-slate border-b border-gray-100 flex items-center gap-1.5">
            <Globe className="h-3 w-3 text-abh-amber" />
            <span>Sélectionner la langue</span>
          </div>

          <div className="py-1">
            {locales.map((l) => {
              const isSelected = l.code === locale;
              return (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => {
                    setLocale(l.code);
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-xs font-medium transition-colors ${
                    isSelected
                      ? 'bg-abh-sapphire text-white'
                      : 'text-abh-midnight hover:bg-abh-pearl hover:text-abh-sapphire'
                  }`}
                  role="menuitem"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={getFlagUrl(l.code, 'w20')}
                      alt={l.name}
                      className="h-3.5 w-5 rounded-xs object-cover"
                    />
                    <span>{l.name}</span>
                  </div>
                  <span className={`text-[10px] uppercase font-bold ${isSelected ? 'text-abh-amber' : 'text-gray-400'}`}>
                    {l.code}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default LanguageSelector;
