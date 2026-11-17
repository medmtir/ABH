'use client';

import React from 'react';
import { motion, useReducedMotion, Variants } from 'framer-motion';

interface RevealProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number;
  duration?: number;
  delay?: number;
  className?: string;
  viewport?: { once?: boolean; margin?: string; amount?: 'some' | 'all' | number };
}

export function Reveal({
  children,
  direction = 'up',
  distance = 28,
  duration = 0.65,
  delay = 0,
  className = '',
  viewport = { once: true, margin: '-50px' },
}: RevealProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const offset = {
    up: { y: distance, x: 0 },
    down: { y: -distance, x: 0 },
    left: { x: distance, y: 0 },
    right: { x: -distance, y: 0 },
    none: { x: 0, y: 0 },
  }[direction];

  return (
    <motion.div
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={viewport}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1], // Smooth luxury cubic-bezier
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface RevealContainerProps {
  children: React.ReactNode;
  stagger?: number;
  delayChildren?: number;
  className?: string;
  viewport?: { once?: boolean; margin?: string };
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: (custom: { stagger: number; delayChildren: number }) => ({
    opacity: 1,
    transition: {
      staggerChildren: custom.stagger,
      delayChildren: custom.delayChildren,
    },
  }),
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export function RevealContainer({
  children,
  stagger = 0.12,
  delayChildren = 0.05,
  className = '',
  viewport = { once: true, margin: '-50px' },
}: RevealContainerProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      variants={containerVariants}
      custom={{ stagger, delayChildren }}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  );
}

export default Reveal;
