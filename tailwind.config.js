/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        darkroom: {
          950: '#0c0b0a',
          900: '#151312',
          800: '#211e1c',
          700: '#2e2a27',
          600: '#433d38',
        },
        safelight: {
          400: '#e8a33d',
          500: '#d68e2a',
          600: '#b8721c',
        },
        crimson: {
          400: '#c2493f',
          500: '#a83a32',
          600: '#8a2e28',
        },
        paper: '#f2ede4',
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};
