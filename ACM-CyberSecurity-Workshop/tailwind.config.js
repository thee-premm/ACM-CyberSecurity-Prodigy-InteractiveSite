/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#05070d',
          dark: '#0a0f1d',
          surface: '#0f172a',
          panel: '#111e38',
          border: '#1e293b',
          'border-neon': '#00f0ff33',
          cyan: '#00f0ff',
          'cyan-dim': '#00a3ad',
          green: '#00ff66',
          'green-dim': '#00b846',
          magenta: '#ff0055',
          'magenta-dim': '#b8003d',
          yellow: '#ffe600',
          orange: '#ff7700',
          purple: '#9d00ff',
          text: '#e2e8f0',
          muted: '#64748b'
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
        display: ['Orbitron', 'Rajdhani', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        'neon-cyan': '0 0 15px rgba(0, 240, 255, 0.4), 0 0 30px rgba(0, 240, 255, 0.2)',
        'neon-green': '0 0 15px rgba(0, 255, 102, 0.4), 0 0 30px rgba(0, 255, 102, 0.2)',
        'neon-magenta': '0 0 15px rgba(255, 0, 85, 0.4), 0 0 30px rgba(255, 0, 85, 0.2)',
        'neon-yellow': '0 0 15px rgba(255, 230, 0, 0.4), 0 0 30px rgba(255, 230, 0, 0.2)',
        'panel': '0 8px 32px 0 rgba(0, 0, 0, 0.56), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scanline': 'scanline 8s linear infinite',
        'glitch': 'glitch 1s linear infinite',
        'radar': 'radar 4s linear infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '1', filter: 'drop-shadow(0 0 8px rgba(0, 240, 255, 0.6))' },
          '50%': { opacity: '0.6', filter: 'drop-shadow(0 0 2px rgba(0, 240, 255, 0.2))' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        },
        radar: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
      }
    },
  },
  plugins: [],
}
