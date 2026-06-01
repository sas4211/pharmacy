import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue:       '#1a3fd4',
          'blue-dark':'#1230a8',
          'blue-light':'#2755e8',
          red:        '#e63946',
          'red-dark': '#c1121f',
          'red-light':'#ff6b74',
          purple:     '#7b2d8b',
          'purple-dark':'#581c87',
          'purple-light':'#a855f7',
        },
        charcoal: '#1e1e2e',
        'mid-gray': '#6b7280',
        'light-gray': '#e0e0f0',
        'off-white': '#f5f4fb',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        inter:   ['Inter', 'sans-serif'],
      },
      borderRadius: {
        card: '14px',
        'card-sm': '9px',
      },
      boxShadow: {
        card: '0 4px 28px rgba(26,63,212,.08)',
        'card-hover': '0 16px 48px rgba(26,63,212,.18)',
        'card-elevated': '0 24px 60px rgba(26,63,212,.12)',
      },
      backgroundImage: {
        'gradient-brand':  'linear-gradient(135deg, #1230a8 0%, #1a3fd4 45%, #7b2d8b 100%)',
        'gradient-accent': 'linear-gradient(135deg, #e63946 0%, #7b2d8b 100%)',
      },
      animation: {
        'gradient-flow': 'gradientFlow 6s ease infinite',
        'float-y':       'floatY 3s ease-in-out infinite',
        'pulse-glow':    'pulseGlow 3s infinite',
        shimmer:         'shimmerSlide 1.8s linear infinite',
        'flash-pulse':   'flashPulse 2s ease-in-out infinite',
        'wa-pulse':      'waPulse 2s ease-in-out infinite',
      },
      keyframes: {
        gradientFlow: {
          '0%,100%': { backgroundPosition: '0% 50%' },
          '50%':     { backgroundPosition: '100% 50%' },
        },
        floatY: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%':     { transform: 'translateY(-12px)' },
        },
        pulseGlow: {
          '0%,100%': { boxShadow: '0 0 0 0 rgba(230,57,70,.35)' },
          '50%':     { boxShadow: '0 0 0 14px rgba(230,57,70,0)' },
        },
        shimmerSlide: {
          from: { backgroundPosition: '-200% 0' },
          to:   { backgroundPosition: '200% 0' },
        },
        flashPulse: {
          '0%,100%': { opacity: '1' },
          '50%':     { opacity: '0.72' },
        },
        waPulse: {
          '0%,100%': { boxShadow: '0 4px 20px rgba(37,211,102,.45)' },
          '50%':     { boxShadow: '0 4px 30px rgba(37,211,102,.75), 0 0 0 10px rgba(37,211,102,.08)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
