const { tokens } = require('./dist/tokens.cjs');
const plugin = require('tailwindcss/plugin');

const colorRoles = Object.entries(tokens.themes.light).filter(([, value]) => value.startsWith('#'));
const rgb = (hex) => [1, 3, 5].map((start) => parseInt(hex.slice(start, start + 2), 16)).join(' ');
const names = { Display: 'display', 'Page title': 'page', 'Section title': 'section', Body: 'body', 'Action / label': 'label', Supporting: 'supporting' };
const fontSize = Object.fromEntries(tokens.typeScale.flatMap((role) => {
  const name = names[role.role];
  return ['mobile', 'desktop'].map((size) => [`bubba-${name}${size === 'desktop' ? '-wide' : ''}`,
    [`${role[`${size}_px`]}px`, { lineHeight: String(role.line_height) }]]);
}));

/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      screens: { 'bubba-compact': `${tokens.layout.breakpoints.compact}px`, 'bubba-wide': `${tokens.layout.breakpoints.wide}px` },
      fontSize,
      colors: {
        bubba: tokens.colors,
        ui: Object.fromEntries(colorRoles.map(([name]) => [name, `rgb(var(--bui-${name}) / <alpha-value>)`])),
      },
      borderRadius: {
        'bubba-control': `${tokens.radius.control}px`,
        'bubba-panel': `${tokens.radius.panel}px`,
      },
      transitionDuration: { 'bubba-feedback': `${tokens.motion.feedback}ms` },
    },
  },
  plugins: [plugin(({ addBase }) => addBase({
    ':root': Object.fromEntries(colorRoles.map(([name, value]) => [`--bui-${name}`, rgb(value)])),
  }))],
};
