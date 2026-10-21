const path = require('node:path');
const uiRoot = path.dirname(require.resolve('@bubbasfw/ui/package.json'));

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    path.join(__dirname, 'App.tsx'),
    path.join(uiRoot, 'src/**/*.{ts,tsx}'),
  ],
  presets: [
    require('nativewind/preset'),
    require('@bubbasfw/ui/tailwind-preset'),
  ],
};
