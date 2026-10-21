/** @type {import('next').NextConfig} */
module.exports = {
  output: 'export',
  basePath: '/bubbas-ui',
  trailingSlash: true,
  reactStrictMode: true,
  images: { unoptimized: true },
  transpilePackages: ['@bubbasfw/ui', 'nativewind', 'react-native-css-interop', 'react-native', 'react-native-web'],
  webpack(config) {
    config.resolve.alias = { ...config.resolve.alias, 'react-native$': 'react-native-web' };
    config.resolve.extensions = ['.web.tsx', '.web.ts', '.web.jsx', '.web.js', ...config.resolve.extensions];
    return config;
  },
};
