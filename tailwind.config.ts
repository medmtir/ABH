import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        abh: {
          // Authentic Bio Huile — Prestige Organic Olive Green & Warm Gold
          sapphire: '#2B4C28', // Deep Olive Green (brand primary, replaces old blue)
          midnight: '#112013', // Deep Forest Olive (brand dark text & headers)
          amber: '#C89417',    // Warm Golden Virgin Oil (brand accent)
          copper: '#A67324',   // Warm Ochre accent
          sand: '#EBF0E6',     // Soft Olive Sand
          pearl: '#F8FAF6',    // Natural Bio Pearl White
          slate: '#5C6B5E',    // Muted Sage Slate
          border: '#DCE4D6',   // Natural Olive Border
        },
      },
      fontFamily: {
        heading: ['var(--font-cormorant)', 'Georgia', 'serif'],
        body: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        arabic: ['var(--font-cairo)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 4px 24px -4px rgba(43, 76, 40, 0.12)',
        'card': '0 1px 3px rgba(43, 76, 40, 0.08), 0 1px 2px rgba(43, 76, 40, 0.04)',
        'card-hover': '0 10px 40px -10px rgba(43, 76, 40, 0.16)',
        'glass': '0 8px 32px rgba(17, 32, 19, 0.08)',
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-3deg)' },
          '75%': { transform: 'rotate(3deg)' },
        },
        'bounce-short': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
        'slide-in-right': 'slide-in-right 0.5s ease-out forwards',
        'scale-in': 'scale-in 0.4s ease-out forwards',
        wiggle: 'wiggle 0.5s ease-in-out',
        'bounce-short': 'bounce-short 0.5s ease-in-out',
      },
    },
  },
  plugins: [],
};

export default config;
