import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#0B1220',
        pulseBlue: '#2563EB',
        pulseGreen: '#22C55E',
        pulseAmber: '#F59E0B',
      },
      boxShadow: {
        glow: '0 0 40px rgba(37, 99, 235, 0.18)',
      },
    },
  },
  plugins: [],
};

export default config;
