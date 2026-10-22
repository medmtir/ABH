'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface ABHLogoProps {
  variant?: 'light' | 'dark' | 'auto';
  showSubtitle?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function ABHLogo({
  variant = 'auto',
  showSubtitle = true,
  className = '',
  size = 'md',
}: ABHLogoProps) {
  const isDark = variant === 'dark';

  const imageSizes = {
    sm: 36,
    md: 46,
    lg: 58,
  };

  const textSizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  const subSizes = {
    sm: 'text-[9px]',
    md: 'text-[11px]',
    lg: 'text-[13px]',
  };

  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-3 transition-opacity hover:opacity-90 ${className}`}
      aria-label="ABH - Authentic Bio Huile Company"
    >
      <div className={`relative flex items-center justify-center overflow-hidden rounded-lg p-1 shadow-sm border ${isDark ? 'bg-black/40 border-white/20' : 'bg-white border-abh-border'}`}>
        <Image
          src="/images/logo.png"
          alt="ABH Logo"
          width={imageSizes[size]}
          height={imageSizes[size]}
          className="object-contain"
          priority
        />
      </div>

      <div className="flex flex-col">
        <div className="flex items-baseline">
          <span
            className={`font-heading font-bold tracking-wider ${textSizes[size]} ${
              isDark ? 'text-white' : 'text-abh-sapphire'
            }`}
          >
            ABH
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-abh-amber ml-1"></span>
        </div>
        {showSubtitle && (
          <span
            className={`font-body uppercase tracking-[0.18em] font-medium ${subSizes[size]} ${
              isDark ? 'text-gray-300' : 'text-abh-slate'
            }`}
          >
            Authentic Bio Huile
          </span>
        )}
      </div>
    </Link>
  );
}

export default ABHLogo;
