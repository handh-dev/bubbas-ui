module.exports = {
  presets: [require('nativewind/preset'), require('../tailwind-preset.cjs')],
  content: ['./packages/ui/src/**/*.{ts,tsx}'],
  important: true,
  corePlugins: { preflight: false },
};
