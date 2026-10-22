import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { mkdir, mkdtemp, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ts from 'typescript';

const root = path.resolve(import.meta.dirname, '..');
const options = process.argv.slice(2);
assert.ok(options.length === 0 || (options.length === 2 && options[0] === '--package-root'), 'Use --package-root DIRECTORY');
const packageRoot = options.length ? path.resolve(options[1]) : path.join(root, 'packages/ui');
const componentEntry = path.join(packageRoot, 'dist/index.js');
const packageRequire = createRequire(path.join(root, 'packages/ui/package.json'));
const { build } = createRequire(import.meta.resolve('tsup'))('esbuild');
const base = path.join(root, 'artifacts/verification');
await mkdir(base, { recursive: true });
const directory = await mkdtemp(path.join(base, 'fonts-'));
const identity = () => ({ commit: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(),
  dirty: Boolean(execFileSync('git', ['status', '--porcelain'], { cwd: root, encoding: 'utf8' }).trim()) });
const report = { sourceIdentity: identity(), componentEntry: path.relative(root, componentEntry), scope: 'Compiled React component rendering with RN primitive shims: font prop forwarding only. Native font resolution, paint and device acceptance remain untested.', checks: {} };
const shim = `import React from 'react';
const flatten = style => Object.assign({}, ...[style].flat(Infinity).filter(Boolean));
const text = primitive => React.forwardRef(({style,children,...props},ref) => {
  globalThis.__bubbaFontProps.push({primitive,style:flatten(style),className:props.className,testID:props.testID,nativeID:props.nativeID,
    text: typeof children === 'string' ? children : undefined,placeholder:props.placeholder});
  return React.createElement(React.Fragment,null,children);
});
const container = React.forwardRef(({children},ref) => React.createElement(React.Fragment,null,typeof children === 'function' ? children({pressed:false}) : children));
export const Text=text('Text'), TextInput=text('TextInput'), View=container, Pressable=container, ScrollView=container;
export const Modal=({visible,children})=>visible?React.createElement(React.Fragment,null,children):null;
export const Image=()=>null,ActivityIndicator=()=>null;
export const Platform={get OS(){return globalThis.__bubbaFontPlatform},select:values=>values[globalThis.__bubbaFontPlatform]??values.default};
export const useColorScheme=()=> 'light';
export const StyleSheet={flatten,create:styles=>styles};
export const Linking={openURL:async()=>{},canOpenURL:async()=>true};`;
const entry = `import React from 'react';
import * as UI from ${JSON.stringify(componentEntry)};
import {ComponentDemo} from ${JSON.stringify(path.join(root, 'apps/docs/src/showcase/Demo.tsx'))};
import {components} from ${JSON.stringify(path.join(root, 'apps/docs/src/showcase/catalog.ts'))};
import {PatternsDemo} from ${JSON.stringify(path.join(root, 'apps/docs/src/showcase/PatternsDemo.tsx'))};
const e=React.createElement;
export function All(){return e(UI.ThemeProvider,{fontFamily:'BubbasBody'},
  ...components.map(item=>e(ComponentDemo,{key:item.name,name:item.name})),e(PatternsDemo),
  e(UI.Dialog,{defaultOpen:true,title:'Dialog font',description:'Dialog description'},e(UI.Text,null,'Dialog body')),
  e(UI.Sheet,{defaultOpen:true,title:'Sheet font'},e(UI.Input,{placeholder:'Sheet input'})));}
export function Overrides(){return e(UI.ThemeProvider,{fontFamily:'BubbasBody'},
  e(UI.Text,{testID:'host'},'Host font'),
  e(UI.ThemeProvider,{appearance:'dark'},e(UI.Text,{testID:'inherited'},'Inherited font')),
  e(UI.ThemeProvider,{fontFamily:'NestedFace'},e(UI.Heading,{testID:'nested'},'Nested font')),
  e(UI.Text,{testID:'explicit',style:[{fontFamily:'ExplicitFace'},{opacity:0.8}]},'Explicit font'),
  e(UI.Input,{testID:'input-explicit',style:{fontFamily:'InputFace'}}),
  e(UI.Text,{testID:'code',variant:'code'},'const count = 0;'));}
export function Default(){return e(UI.ThemeProvider,null,e(UI.Text,{testID:'default'},'Host platform default'),e(UI.Input,{testID:'default-input'}));}`;

try {
  const shimFile = path.join(directory, 'react-native.mjs');
  await writeFile(shimFile, shim);
  const output = path.join(directory, 'fixture.mjs');
  await build({ stdin: { contents: entry, resolveDir: root, loader: 'tsx' }, outfile: output, bundle: true, format: 'esm', platform: 'node',
    jsx: 'automatic', jsxImportSource: 'react', tsconfigRaw: { compilerOptions: { jsx: 'react-jsx', jsxImportSource: 'react' } },
    external: ['react', 'react/jsx-runtime'], logLevel: 'silent', plugins: [{ name: 'native-font-boundary', setup(plugin) {
      plugin.onResolve({ filter: /^react-native$/ }, () => ({ path: shimFile }));
      plugin.onResolve({ filter: /^@bubbasfw\/ui$/ }, () => ({ path: componentEntry }));
      plugin.onResolve({ filter: /^nativewind\/jsx-runtime$/ }, () => ({ path: 'react/jsx-runtime', external: true }));
      plugin.onResolve({ filter: /^tailwind-merge$/ }, () => ({ path: packageRequire.resolve('tailwind-merge') }));
      plugin.onResolve({ filter: /^nativewind$/ }, () => ({ path: 'native-vars', namespace: 'font-shim' }));
      plugin.onLoad({ filter: /.*/, namespace: 'font-shim' }, () => ({ contents: 'export const vars = values => values;', loader: 'js' }));
    } }] });
  const fixture = await import(pathToFileURL(output).href);
  const render = (Component, platform) => {
    globalThis.__bubbaFontProps = []; globalThis.__bubbaFontPlatform = platform;
    renderToStaticMarkup(React.createElement(Component));
    return globalThis.__bubbaFontProps;
  };
  for (const platform of ['ios', 'android']) {
    const all = render(fixture.All, platform);
    assert.ok(all.length > 60, 'Render the complete component catalog, patterns, fields and native modal content');
    const branded = all.filter(item => !item.className?.split(' ').includes('font-mono'));
    for (const item of branded) assert.equal(item.style.fontFamily, 'BubbasBody', `Host font must reach ${platform} ${item.primitive}: ${item.text ?? item.placeholder ?? item.nativeID}`);
    assert.ok(all.some(item => item.primitive === 'TextInput' && item.placeholder === 'Sheet input'), 'Native Modal preserves React font context');
    const overrides = render(fixture.Overrides, platform);
    const family = id => overrides.find(item => item.testID === id)?.style.fontFamily;
    assert.equal(family('host'), 'BubbasBody'); assert.equal(family('inherited'), 'BubbasBody');
    assert.equal(family('nested'), 'NestedFace'); assert.equal(family('explicit'), 'ExplicitFace');
    assert.equal(family('input-explicit'), 'InputFace'); assert.equal(family('code'), undefined, 'Code retains its monospace utility');
    const defaults = render(fixture.Default, platform);
    assert.ok(defaults.every(item => !item.style.fontFamily), 'Omitting the contract preserves existing platform/host defaults');
    report.checks[platform] = { primitives: all.length, textInputs: all.filter(item => item.primitive === 'TextInput').length,
      allSharedTextReceivesHostFamily: true, nestedProviderAndModal: true, explicitOverride: true, codePreservesMonospace: true, omittedPreservesDefaults: true };
    await writeFile(path.join(directory, `${platform}-props.json`), `${JSON.stringify(all, null, 2)}\n`);
  }
  const app = await readFile(path.join(root, 'examples/expo/App.tsx'), 'utf8');
  assert.match(app, /useFonts/); assert.match(app, /fontFamily=/);
  for (const name of ['montserrat.ttf', 'OFL.txt']) assert.deepEqual(
    await readFile(path.join(root, 'examples/expo/assets/fonts', name)),
    await readFile(path.join(root, 'apps/docs/public/fonts', name)), 'Expo uses the exact cleared public font/license');
  const textFiles = await readdir(path.join(packageRoot, 'src'), { recursive: true });
  for (const file of textFiles.filter(name => name.endsWith('.tsx') && name !== 'internal/native-text.tsx')) {
    const tree = ts.createSourceFile(file, await readFile(path.join(packageRoot, 'src', file), 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    for (const node of tree.statements.filter(ts.isImportDeclaration)) {
      if (node.moduleSpecifier.text !== 'react-native') continue;
      const imports = node.importClause?.namedBindings;
      if (imports && ts.isNamedImports(imports)) assert.ok(!imports.elements.some(item => !item.isTypeOnly && (item.propertyName ?? item.name).text === 'Text'),
        `Shared native text must use the scoped adapter: ${file}`);
    }
  }
  report.checks.licensedExpoExample = true;
  report.checks.nativeTextBoundary = true;
  assert.deepEqual(identity(), report.sourceIdentity, 'Source changed during forwarding verification');
  report.status = 'passed';
} catch (error) { report.status = 'failed'; report.error = error.stack; process.exitCode = 1; }
finally {
  delete globalThis.__bubbaFontProps; delete globalThis.__bubbaFontPlatform;
  await writeFile(path.join(directory, 'report.json'), `${JSON.stringify(report, null, 2)}\n`);
  await writeFile(path.join(base, 'font-forwarding-latest.json'), `${JSON.stringify({ ...report, evidence: path.relative(root, directory) }, null, 2)}\n`);
  console.log(`${report.status}: ${path.relative(root, directory)}/report.json`);
  if (report.error) console.error(report.error);
}
