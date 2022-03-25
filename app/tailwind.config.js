/* eslint-disable unicorn/prefer-module */


module.exports = {
 
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './frontend/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontFamily: {
    'monospaced':'Montserrat' },
    
    
    extend: {},
  },
  plugins: [require('@tailwindcss/forms')],
}
