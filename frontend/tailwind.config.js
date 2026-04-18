/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        // Distinctive editorial serif for display, clean grotesque for body, mono for metadata
        display: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
        body: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        paper: '#F5F1EA',      // warm off-white
        ink: '#14130F',         // near-black
        ember: '#D8572A',       // the bold accent (terracotta/ember)
        dust: '#8C8578',        // muted secondary
        hairline: '#1C1B17',    // very dark for rules
      },
      letterSpacing: {
        tightest: '-0.04em',
      },
    },
  },
  plugins: [],
};
