/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,svelte}'
  ],
  theme: {
    extend: {
      colors: {
        'mandate-red': '#DC2626',
        'mandate-orange': '#EA580C',
        'mandate-deep-red': '#991B1B',
        'mandate-slate': '#4A5568',
        'mandate-gold': '#FFD700',
        'mandate-dark': '#1A202C',
        'mandate-card': '#2D3748',
        'mandate-light': '#E2E8F0',
        'mandate-green': '#16A34A',
        'mandate-pending': '#F59E0B'
      },
      fontFamily: {
        'official': ['IBM Plex Sans', 'sans-serif'],
        'impact': ['Oswald', 'sans-serif'],
        'body': ['Inter', 'sans-serif']
      },
      letterSpacing: {
        'mandate': '0.05em'
      }
    }
  }
};
