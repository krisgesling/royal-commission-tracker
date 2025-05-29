/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,svelte}'
  ],
  theme: {
    extend: {
      colors: {
        // Primary Brand Colors (from style guide)
        'primary-navy': '#2c3e50',
        'primary-red': '#e74c3c',
        
        // Status Colors
        'status-implemented': '#27ae60',
        'status-partial': '#f39c12',
        'status-pending': '#e67e22',
        'status-ignored': '#e74c3c',
        
        // Neutral Colors
        'neutral-100': '#fafafa',
        'neutral-200': '#ecf0f1',
        'neutral-600': '#666666',
        'neutral-800': '#1a1a1a',
        'neutral-900': '#2c3e50',
        
        // Legacy colors for backward compatibility
        'mandate-red': '#e74c3c',
        'mandate-orange': '#f39c12',
        'mandate-deep-red': '#c0392b',
        'mandate-slate': '#34495e',
        'mandate-gold': '#f39c12',
        'mandate-dark': '#2c3e50',
        'mandate-card': '#ffffff',
        'mandate-light': '#1a1a1a',
        'mandate-green': '#27ae60',
        'mandate-pending': '#f39c12'
      },
      fontFamily: {
        'sans': ['Inter', 'sans-serif'],
        'serif': ['Crimson Text', 'serif'],
        'display': ['Inter', 'sans-serif'],
        // Legacy fonts for backward compatibility
        'official': ['Inter', 'sans-serif'],
        'impact': ['Inter', 'sans-serif'],
        'body': ['Inter', 'sans-serif']
      },
      letterSpacing: {
        'mandate': '0.05em'
      },
      boxShadow: {
        'card': '0 4px 12px rgba(0,0,0,0.1)',
        'card-hover': '0 8px 24px rgba(0,0,0,0.15)'
      }
    }
  }
};
