
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { existsSync } from 'node:fs';
import assert from 'node:assert/strict';
process.chdir(new URL('..', import.meta.url).pathname);
const require = createRequire(import.meta.url);
const { build } = createRequire(require.resolve('tsup'))('esbuild');
// Resolve the web runtime through NativeWind's own dependency rather than a host alias.
const nativewindRequire = createRequire(require.resolve('nativewind'));
const webAPI = nativewindRequire.resolve('react-native-css-interop/src/runtime/web/api.ts');
const rnwRoot = path.dirname(require.resolve('react-native-web/package.json'));
assert.equal(JSON.parse(await readFile(path.join(rnwRoot, 'package.json'), 'utf8')).version, '0.21.4', 'Re-review RNW form adapter when upgrading');
const formSources = { Pressable: await readFile(path.join(rnwRoot, 'dist/exports/Pressable/index.js'), 'utf8'), View: await readFile(path.join(rnwRoot, 'dist/exports/View/index.js'), 'utf8') };
assert.equal(formSources.View.split('href: true,').length, 2, 'RNW View forward allowlist changed');
formSources.View = formSources.View.replace('href: true,', 'href: true, type: true,');
for (const host of ['node', 'browser']) {
for (const format of ['esm', 'cjs']) {
 for (const [name, entry] of [['web', 'packages/ui/src/index.ts'], ['web-native', 'packages/ui/web/native.ts'], ['web-runtime', webAPI]]) {
  await build({ entryPoints: [entry], tsconfigRaw: { compilerOptions: { jsx: 'react-jsx', jsxImportSource: 'react' } }, outfile: `packages/ui/dist/${name}${host === 'browser' ? '.browser' : ''}.${format === 'esm' ? 'js' : 'cjs'}`, bundle: true, format,
    platform: 'browser', target: 'es2022', jsx: 'automatic', jsxImportSource: 'react', banner: { js: '"use client";' },
    external: ['react', 'react/*', 'react-native-web', 'tailwind-merge'],
    plugins: [{ name: 'universal-web', setup(build) {
      build.onResolve({ filter: /^bubbas:form-pressable$/ }, () => ({ path: 'Pressable', namespace: 'rnw-form' }));
      build.onLoad({ filter: /.*/, namespace: 'rnw-form' }, (args) => ({ contents: formSources[args.path], loader: 'js', resolveDir: path.join(rnwRoot, 'dist/exports', args.path) }));
      build.onResolve({ filter: /^\./, namespace: 'rnw-form' }, (args) => {
        if (args.importer === 'Pressable' && args.path === '../View') return { path: 'View', namespace: 'rnw-form' };
        const relative = path.relative(path.join(rnwRoot, 'dist'), path.resolve(args.resolveDir, args.path));
        const name = relative.endsWith('.js') ? relative : existsSync(path.join(rnwRoot, 'dist', `${relative}.js`)) ? `${relative}.js` : `${relative}/index.js`;
        return { path: name, namespace: 'rnw-external' };
      });
      build.onLoad({ filter: /.*/, namespace: 'rnw-external' }, async (args) => {
        const external = `react-native-web/dist/${host === 'node' ? 'cjs/' : ''}${args.path}`;
        if (host === 'browser') {
          const source = await readFile(path.join(rnwRoot, 'dist', args.path), 'utf8');
          return { contents: `export * from '${external}'; ${source.includes('export default') ? `export { default } from '${external}';` : ''}`, loader: 'js' };
        }
        return { contents: `import * as mod from '${external}'; const api = mod.default ?? mod; export default api.default ?? api; export * from '${external}';`, loader: 'js' };
      });
      build.onResolve({ filter: /^react-native-web\// }, (args) => ({ path: args.path, external: true }));
      build.onResolve({ filter: /^react-native$/ }, (args) => args.importer.includes('node_modules') ? { path: 'react-native-web', external: true } : { path: new URL('../packages/ui/web/native.ts', import.meta.url).pathname });
      build.onResolve({ filter: /^react-native-css-interop\/dist\/runtime\/web\/api\.js$/ }, () => ({ path: webAPI }));
      build.onResolve({ filter: /^nativewind$/ }, () => ({ path: webAPI }));
    }}],
  });
 }
}
}
await writeFile('packages/ui/dist/web.d.ts', "export * from './index';\n");
await writeFile('packages/ui/dist/web.d.cts', "export * from './index.cjs';\n");
execFileSync('pnpm', ['exec', 'tailwindcss', '-c', 'packages/ui/web/tailwind.config.cjs', '-i', 'packages/ui/web/styles.css', '-o', 'packages/ui/dist/web.css', '--minify'], { stdio: 'inherit' });
