const path = require('node:path');
const uiRoot = path.dirname(require.resolve('@bubbasfw/ui/package.json'));
module.exports = {
  darkMode: 'class',
  content: [path.join(__dirname, '{pages,src}/**/*.{ts,tsx}'), path.join(uiRoot, 'src/**/*.{ts,tsx}')],
  presets: [require('nativewind/preset'), require('@bubbasfw/ui/tailwind-preset')],
  theme: { extend: { screens: { short: { raw: '(min-width: 960px) and (max-height: 800px)' } } } },
  important: true,
};
