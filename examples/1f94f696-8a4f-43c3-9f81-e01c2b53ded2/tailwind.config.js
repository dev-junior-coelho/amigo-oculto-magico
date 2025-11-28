/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin');
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [
            plugin(function ({ addUtilities }) {
                addUtilities(
                    {
                        '.border-t-solid': { 'border-top-style': 'solid' },
                        '.border-r-solid': { 'border-right-style': 'solid' },
                        '.border-b-solid': { 'border-bottom-style': 'solid' },
                        '.border-l-solid': { 'border-left-style': 'solid' },
                        '.border-t-dashed': { 'border-top-style': 'dashed' },
                        '.border-r-dashed': { 'border-right-style': 'dashed' },
                        '.border-b-dashed': { 'border-bottom-style': 'dashed' },
                        '.border-l-dashed': { 'border-left-style': 'dashed' },
                        '.border-t-dotted': { 'border-top-style': 'dotted' },
                        '.border-r-dotted': { 'border-right-style': 'dotted' },
                        '.border-b-dotted': { 'border-bottom-style': 'dotted' },
                        '.border-l-dotted': { 'border-left-style': 'dotted' }
                    },
                    ['responsive']
                );
            })
        ],
};