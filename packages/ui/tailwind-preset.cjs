const { tokens } = require('./dist/tokens.cjs');
const plugin = require('tailwindcss/plugin');

const colorRoles = Object.entries(tokens.themes.light).filter(([, value]) => value.startsWith('#'));
const rgb = (hex) => [1, 3, 5].map((start) => parseInt(hex.slice(start, start + 2), 16)).join(' ');

/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        bubba: tokens.colors,
        ui: Object.fromEntries(colorRoles.map(([name]) => [name, `rgb(var(--bui-${name}) / <alpha-value>)`])),
      },
      borderRadius: {
        'bubba-control': `${tokens.radius.control}px`,
        'bubba-panel': `${tokens.radius.panel}px`,
      },
    },
  },
  plugins: [plugin(({ addBase }) => addBase({
    ':root': Object.fromEntries(colorRoles.map(([name, value]) => [`--bui-${name}`, rgb(value)])),
  }))],
};
