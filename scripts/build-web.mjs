
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import { writeFile } from 'node:fs/promises';
process.chdir(new URL('..', import.meta.url).pathname);
const require = createRequire(import.meta.url);
const { build } = createRequire(require.resolve('tsup'))('esbuild');
// Resolve the web runtime through NativeWind's own dependency rather than a host alias.
const nativewindRequire = createRequire(require.resolve('nativewind'));
const webAPI = nativewindRequire.resolve('react-native-css-interop/src/runtime/web/api.ts');
for (const format of ['esm', 'cjs']) {
 for (const [name, entry] of [['web', 'packages/ui/src/index.ts'], ['web-native', 'packages/ui/web/native.ts'], ['web-runtime', webAPI]]) {
  await build({ entryPoints: [entry], tsconfigRaw: { compilerOptions: { jsx: 'react-jsx', jsxImportSource: 'react' } }, outfile: `packages/ui/dist/${name}.${format === 'esm' ? 'js' : 'cjs'}`, bundle: true, format,
    platform: 'browser', target: 'es2022', jsx: 'automatic', jsxImportSource: 'react', banner: { js: '"use client";' },
    external: ['react', 'react/*', 'react-native-web', 'tailwind-merge'],
    plugins: [{ name: 'universal-web', setup(build) {
      build.onResolve({ filter: /^react-native$/ }, (args) => args.importer.includes('node_modules') ? { path: 'react-native-web', external: true } : { path: new URL('../packages/ui/web/native.ts', import.meta.url).pathname });
      build.onResolve({ filter: /^react-native-css-interop\/dist\/runtime\/web\/api\.js$/ }, () => ({ path: webAPI }));
      build.onResolve({ filter: /^nativewind$/ }, () => ({ path: webAPI }));
    }}],
  });
 }
}
await writeFile('packages/ui/dist/web.d.ts', "export * from './index';\n");
await writeFile('packages/ui/dist/web.d.cts', "export * from './index.cjs';\n");
execFileSync('pnpm', ['exec', 'tailwindcss', '-c', 'packages/ui/web/tailwind.config.cjs', '-i', 'packages/ui/web/styles.css', '-o', 'packages/ui/dist/web.css', '--minify'], { stdio: 'inherit' });
