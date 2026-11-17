'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { motion, useScroll, useSpring, useReducedMotion } from 'framer-motion';

export function ScrollProgressBar() {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Skip on admin dashboard or if reduced motion is requested
  if (pathname?.startsWith('/admin') || shouldReduceMotion) {
    return null;
  }

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-[2.5px] z-50 origin-left pointer-events-none bg-gradient-to-r from-abh-amber via-[#E6B74A] to-abh-copper shadow-[0_0_10px_rgba(200,148,23,0.6)]"
      aria-hidden="true"
    />
  );
}

export default ScrollProgressBar;
