'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface SplitTitleProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

/**
 * SplitLine / SplitWord reveals text by lifting it from an overflow-hidden mask.
 * Creates an editorial, award-winning typography entrance.
 */
export function SplitLine({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <span className={`inline-block ${className}`}>{children}</span>;
  }

  return (
    <span className="inline-block overflow-hidden align-top">
      <motion.span
        initial={{ y: '110%', opacity: 0 }}
        animate={{ y: '0%', opacity: 1 }}
        transition={{
          duration: 0.85,
          delay,
          ease: [0.22, 1, 0.36, 1],
        }}
        className={`inline-block ${className}`}
      >
        {children}
      </motion.span>
    </span>
  );
}

export function SplitWords({
  text,
  className = '',
  wordClassName = '',
  delay = 0,
  stagger = 0.04,
}: {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  stagger?: number;
}) {
  const shouldReduceMotion = useReducedMotion();
  const words = text.split(' ');

  if (shouldReduceMotion) {
    return <span className={className}>{text}</span>;
  }

  return (
    <span className={`inline-flex flex-wrap gap-x-[0.28em] ${className}`}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden">
          <motion.span
            initial={{ y: '115%', opacity: 0 }}
            animate={{ y: '0%', opacity: 1 }}
            transition={{
              duration: 0.75,
              delay: delay + i * stagger,
              ease: [0.22, 1, 0.36, 1],
            }}
            className={`inline-block ${wordClassName}`}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
