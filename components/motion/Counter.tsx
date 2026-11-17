'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';

interface CounterProps {
  value: string; // e.g. "25+", "5 000+", "6", "100%"
  className?: string;
  duration?: number;
}

export function Counter({ value, className = '', duration = 1.8 }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const shouldReduceMotion = useReducedMotion();

  // Parse numeric target and suffix from strings like "25+", "5 000+", "100%"
  const cleanNumeric = parseInt(value.replace(/[^0-9]/g, ''), 10) || 0;
  const suffix = value.replace(/[0-9\s]/g, ''); // "+", "%", etc.
  const hasThousandSeparator = value.includes(' ') || cleanNumeric >= 1000;

  const [current, setCurrent] = useState(shouldReduceMotion ? cleanNumeric : 0);

  useEffect(() => {
    if (shouldReduceMotion) {
      setCurrent(cleanNumeric);
      return;
    }

    if (!isInView) return;

    let startTime: number | null = null;
    let animationFrameId: number;

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const easedProgress = easeOutCubic(progress);

      const nextVal = Math.floor(easedProgress * cleanNumeric);
      setCurrent(nextVal);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setCurrent(cleanNumeric);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isInView, cleanNumeric, duration, shouldReduceMotion]);

  const formattedNumber = hasThousandSeparator
    ? current.toLocaleString('fr-FR').replace(/\u202F/g, ' ')
    : current.toString();

  return (
    <span ref={ref} className={className}>
      {formattedNumber}
      {suffix}
    </span>
  );
}

export default Counter;
