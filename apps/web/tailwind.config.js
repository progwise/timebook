/* eslint-disable unicorn/prefer-module */

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './frontend/**/*.{js,ts,jsx,tsx}',
    '../../packages/ui/**/*.{js,ts,jsx,tsx}',
    '../../packages/ui/**/*.{js,ts,jsx,tsx}',
    '!../../packages/ui/node_modules',
  ],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: ['valentine', 'cyberpunk', 'light', 'dark', 'cupcake'],
  },
  plugins: [require('@tailwindcss/forms'), require('@headlessui/tailwindcss'), require('daisyui')],
}
