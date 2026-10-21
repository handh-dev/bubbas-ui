import { defineConfig } from 'tsup';

export default defineConfig({
  entry: { index: 'src/index.ts', tokens: 'src/tokens.ts' },
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  splitting: false,
  treeshake: true,
  target: 'es2022',
  external: ['react', 'react-native', 'react-native-web', 'nativewind', 'react-native-css-interop', 'tailwind-merge'],
  esbuildOptions(options) {
    options.jsx = 'automatic';
    options.jsxImportSource = 'nativewind';
  },
  // Preserve the client boundary for the component entry only. Tokens remain server-safe.
  onSuccess: async () => {
    const { readFile, writeFile } = await import('node:fs/promises');
    for (const name of ['index.js', 'index.cjs']) {
      const file = `dist/${name}`;
      const content = await readFile(file, 'utf8');
      await writeFile(file, `"use client";\n${content}`);
    }
  },
});
