import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-geist-sans)', 'ui-sans-serif', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'ui-monospace', 'monospace'],
      },
      colors: {
        brand: 'var(--color-brand)',
        'brand-light': 'var(--color-brand-light)',
        'brand-dark': 'var(--color-brand-dark)',
        'brand-50': 'var(--color-brand-50)',
        'brand-100': 'var(--color-brand-100)',
        accent: 'var(--color-accent)',
        'accent-soft': 'var(--color-accent-soft)',
        bg: 'var(--color-bg)',
        'bg-2': 'var(--color-bg-2)',
        surface: 'var(--color-surface)',
        'surface-solid': 'var(--color-surface-solid)',
        'surface-muted': 'var(--color-surface-muted)',
        border: 'var(--color-border)',
        'border-strong': 'var(--color-border-strong)',
        'input-bg': 'var(--color-input-bg)',
        'input-border': 'var(--color-input-border)',
        'input-placeholder': 'var(--color-input-placeholder)',
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-muted': 'var(--color-text-muted)',
        'text-inverted': 'var(--color-text-inverted)',
        success: 'var(--color-success)',
        'success-soft': 'var(--color-success-soft)',
        warning: 'var(--color-warning)',
        'warning-soft': 'var(--color-warning-soft)',
        error: 'var(--color-error)',
        'error-soft': 'var(--color-error-soft)',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        DEFAULT: 'var(--radius)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
      },
      boxShadow: {
        xs: 'var(--shadow-xs)',
        sm: 'var(--shadow-sm)',
        DEFAULT: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        glow: 'var(--glow-brand)',
        'glow-accent': 'var(--glow-accent)',
      },
    },
  },
  darkMode: ['class', '[data-theme="dark"]'], // enables dark mode via data-theme attribute
};
export default config;
