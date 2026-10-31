/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        // Shared system font stacks avoid external font requests.
        display: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        bg: 'var(--bg)',
        ink: 'var(--ink)',
        paper: 'var(--surface)',
        ember: 'var(--accent)',
        surface: 'var(--surface)',
        card: 'var(--card)',
        border: 'var(--border)',
        text: 'var(--ink)',
        muted: 'var(--ink-mute)',
        accent: 'var(--accent)',
        accent2: 'var(--accent2)',
        'accent-bg': 'var(--accent-bg)',
        'accent2-bg': 'var(--accent2-bg)',
      },
      letterSpacing: {
        tightest: '-0.04em',
      },
    },
  },
  plugins: [],
};
