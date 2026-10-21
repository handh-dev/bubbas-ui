const path = require('node:path');
const uiRoot = path.dirname(require.resolve('@bubbasfw/ui/package.json'));

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    path.join(__dirname, 'pages/**/*.{ts,tsx}'),
    path.join(uiRoot, 'src/**/*.{ts,tsx}'),
  ],
  presets: [
    require('nativewind/preset'),
    require('@bubbasfw/ui/tailwind-preset'),
  ],
  // Keep NativeWind utilities above React Native Web's default style rules.
  important: true,
};
