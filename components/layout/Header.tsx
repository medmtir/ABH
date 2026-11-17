'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ABHLogo } from '@/components/ui/ABHLogo';
import { LanguageSelector } from './LanguageSelector';
import { QuoteModal } from '@/components/ui/QuoteModal';
import { Menu, X, ArrowUpRight, Sparkles, Lock } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/context';

export function Header() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHome = pathname === '/';
  const isTransparent = isHome && !scrolled;

  const navLinks = [
    { href: '/', label: t('nav.home') },
    { href: '/products', label: t('nav.products') },
    { href: '/about', label: t('nav.about') },
    { href: '/certifications', label: t('nav.certifications') },
    { href: '/export', label: t('nav.export') },
    { href: '/contact', label: t('nav.contact') },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isTransparent
            ? 'bg-transparent border-b border-white/10 pt-[max(env(safe-area-inset-top,0px),0.75rem)] pb-3 sm:py-3.5 shadow-none'
            : 'bg-white/95 backdrop-blur-md border-b border-abh-border/80 shadow-premium pt-[max(env(safe-area-inset-top,0px),0.5rem)] pb-2 sm:py-2.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo: Compact on mobile, standard on desktop */}
            <div className="shrink-0">
              <ABHLogo
                size="sm"
                className="sm:hidden"
                variant={isTransparent ? 'dark' : 'auto'}
              />
              <ABHLogo
                size="md"
                className="hidden sm:inline-flex"
                variant={isTransparent ? 'dark' : 'auto'}
              />
            </div>

            {/* Desktop Navigation */}
            <nav
              className={`hidden lg:flex items-center gap-1 rounded-full p-1 transition-all duration-300 ${
                isTransparent
                  ? 'bg-white/10 backdrop-blur-md border border-white/15 shadow-sm'
                  : 'bg-abh-sand/50 border border-abh-border/80 shadow-xs'
              }`}
            >
              {navLinks.map((link) => {
                const isActive =
                  link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200 ${
                      isActive
                        ? isTransparent
                          ? 'bg-abh-amber text-abh-midnight font-bold shadow-xs'
                          : 'bg-abh-sapphire text-white shadow-xs'
                        : isTransparent
                        ? 'text-white/90 hover:text-abh-amber hover:bg-white/10'
                        : 'text-abh-midnight hover:text-abh-amber hover:bg-white/90'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right actions */}
            <div className="hidden sm:flex items-center gap-3">
              <LanguageSelector variant={isTransparent ? 'dark' : 'light'} />

              <button
                type="button"
                onClick={() => setQuoteModalOpen(true)}
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-abh-amber to-abh-copper px-5 py-2 text-xs font-semibold text-white shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
              >
                <span>Demander un Devis</span>
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center gap-2 lg:hidden">
              <LanguageSelector variant={isTransparent ? 'dark' : 'light'} />
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`rounded-xl p-2 transition-colors border ${
                  isTransparent
                    ? 'text-white hover:bg-white/10 border-white/20'
                    : 'text-abh-midnight hover:bg-abh-sand/40 border-abh-border/60'
                }`}
                aria-label="Menu"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu drawer backdrop */}
        {mobileMenuOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-xs z-30 animate-fade-in"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Mobile menu drawer starting right under header */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute inset-x-0 top-full z-40 bg-white border-b border-abh-border shadow-2xl p-5 max-h-[calc(100vh-100%)] overflow-y-auto pb-safe transition-all animate-fade-in-up">
            <nav className="flex flex-col space-y-1.5 mb-5">
              {navLinks.map((link) => {
                const isActive =
                  link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`rounded-xl px-4 py-3 text-sm font-semibold transition-colors flex items-center justify-between ${
                      isActive
                        ? 'bg-abh-sapphire text-white shadow-xs'
                        : 'text-abh-midnight hover:bg-abh-sand/40'
                    }`}
                  >
                    <span>{link.label}</span>
                    <ArrowUpRight className="h-4 w-4 opacity-70" />
                  </Link>
                );
              })}
            </nav>

            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setQuoteModalOpen(true);
              }}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-abh-amber to-abh-copper py-3 text-sm font-semibold text-white shadow-md mb-4"
            >
              <Sparkles className="h-4 w-4" />
              <span>Demander un Devis RFQ</span>
            </button>

            {/* Direct Admin Link in Mobile Menu */}
            <div className="pt-3 border-t border-abh-border/70 flex justify-center">
              <Link
                href="/admin/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs text-abh-slate hover:text-abh-sapphire flex items-center gap-1.5 font-medium py-1"
              >
                <Lock className="h-3 w-3 text-abh-amber" />
                <span>Accès Espace Direction (Admin)</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Quote modal */}
      <QuoteModal isOpen={quoteModalOpen} onClose={() => setQuoteModalOpen(false)} />
    </>
  );
}

export default Header;
