import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: 'var(--color-brand)',
        'brand-light': 'var(--color-brand-light)',
        'brand-dark': 'var(--color-brand-dark)',
        accent: 'var(--color-accent)',
        bg: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        border: 'var(--color-border)',
        'input-bg': 'var(--color-input-bg)',
        'input-border': 'var(--color-input-border)',
        'input-placeholder': 'var(--color-input-placeholder)',
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-inverted': 'var(--color-text-inverted)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        error: 'var(--color-error)',
      },
    },
  },
  darkMode: ['class', '[data-theme="dark"]'], // enables dark mode via data-theme attribute
};
export default config;
