import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      borderRadius: { card: '1.25rem' },
      boxShadow: {
        floating: '0 16px 45px -22px rgba(15, 23, 42, 0.24)',
        soft: '0 8px 24px -12px rgba(15, 23, 42, 0.13)',
      },
      fontFamily: { sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'] },
    },
  },
  plugins: [],
} satisfies Config
