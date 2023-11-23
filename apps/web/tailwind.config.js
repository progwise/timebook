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
    themes: [
      'winter',
      'night',
      'valentine',
      'cyberpunk',
      'dark',
      'black',
      'coffee',
      'luxury',
      'pastel',
      'forest',
      'dracula',
    ],
    darkTheme: 'forest',
  },
  plugins: [require('@headlessui/tailwindcss'), require('daisyui')],
}
