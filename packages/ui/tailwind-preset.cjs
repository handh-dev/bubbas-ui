const { tokens } = require('./dist/tokens.cjs');

/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: { bubba: tokens.colors },
      borderRadius: {
        'bubba-control': `${tokens.radius.control}px`,
        'bubba-panel': `${tokens.radius.panel}px`,
      },
    },
  },
};
