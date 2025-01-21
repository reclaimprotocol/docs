import { createPreset } from 'fumadocs-ui/tailwind-plugin';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './content/**/*.{md,mdx}',
    './mdx-components.{ts,tsx}',
    './node_modules/fumadocs-ui/dist/**/*.js',
  ],
  presets: [createPreset()],
  theme: {
    extend: {
      fontSize: {
        base: '1rem',
        sm: '0.787rem',
        lg: '1.012rem',
        xl: '1.125rem',
        '2xl': '1.35rem',
        '3xl': '1.687rem',
        '4xl': '2.025rem',
        '5xl': '2.7rem', 
      },
    },
  },
};
