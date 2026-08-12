/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Semantic tokens — driven by CSS variables so light/dark share one class set.
        bg: 'rgb(var(--bg) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        raised: 'rgb(var(--raised) / <alpha-value>)',
        line: 'rgb(var(--line) / <alpha-value>)',
        fg: 'rgb(var(--fg) / <alpha-value>)',
        muted: 'rgb(var(--muted) / <alpha-value>)',
        // Brand palette lifted from the StepOut mark — kente red/gold/green, no purple.
        ink: { DEFAULT: '#0B0B1F', 700: '#171736', 500: '#2A2A5A' },
        green: { DEFAULT: '#0E8F5B', 600: '#0B6B45', 300: '#7DDBAF' },
        magenta: { DEFAULT: '#FF3D8A', 600: '#E82571', 300: '#FF8FB8' },
        ember: { DEFAULT: '#FF7A2F', 600: '#EA6314' },
        sun: { DEFAULT: '#FFC93C', 600: '#E8AF12' },
      },
      fontFamily: {
        display: ['Outfit', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px rgb(11 11 31 / 0.04), 0 8px 24px -12px rgb(11 11 31 / 0.18)',
        lift: '0 2px 4px rgb(11 11 31 / 0.06), 0 18px 40px -16px rgb(11 11 31 / 0.28)',
      },
      backgroundImage: {
        // Kente-stripe rhythm — red, gold, green — used for section rules,
        // active-tab underlines and the footer strip.
        horizon: 'linear-gradient(90deg, #CE1126 0%, #FCD116 30%, #006B3F 60%, #FCD116 80%, #CE1126 100%)',
        dusk: 'linear-gradient(135deg, #171736 0%, #0B6B45 45%, #FF3D8A 100%)',
        kente:
          'repeating-linear-gradient(115deg, #CE1126 0 70px, #FCD116 70px 100px, #006B3F 100px 170px, #0B0B1F 170px 200px, #FCD116 200px 230px, #CE1126 230px 300px)',
      },
      keyframes: {
        'fade-up': { '0%': { opacity: '0', transform: 'translateY(8px)' }, '100%': { opacity: '1', transform: 'none' } },
        shimmer: { '100%': { transform: 'translateX(100%)' } },
      },
      animation: {
        'fade-up': 'fade-up .35s ease-out both',
        shimmer: 'shimmer 1.6s infinite',
      },
    },
  },
  plugins: [],
};
