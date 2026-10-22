const fonts = require('./native-fonts.json');

module.exports = ({ config }) => ({
  ...config,
  plugins: [...(config.plugins ?? []), ['expo-font', fonts]],
});
