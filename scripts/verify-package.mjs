import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { createWriteStream } from 'node:fs';
import { cp, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { createServer } from 'node:net';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { verifyWeb } from './verify-web.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ui = path.join(root, 'packages/ui');
const base = path.join(root, 'artifacts/verification');
await mkdir(base, { recursive: true });
const evidence = await mkdtemp(path.join(base, 'run-'));
const fixtures = path.join(evidence, 'consumers');
const mode = process.argv.includes('--artifact-only') ? 'artifact' : process.argv.includes('--native-only') ? 'native' : 'full';
const report = { package: '@bubbasfw/ui', mode, checks: {}, nativeDeviceRuntime: 'not tested' };
const env = { ...process.env, CI: '1', NEXT_TELEMETRY_DISABLED: '1', EXPO_NO_TELEMETRY: '1' };

async function run(command, args, cwd, name) {
  console.log(`${name}: ${command} ${args.join(' ')}`);
  const log = createWriteStream(path.join(evidence, `${name}.log`));
  log.write(`$ ${command} ${args.join(' ')}\n`);
  let stdout = '';
  try {
    await new Promise((resolve, reject) => {
      const child = spawn(command, args, { cwd, env, stdio: ['ignore', 'pipe', 'pipe'] });
      child.stdout.on('data', (chunk) => { stdout += chunk; log.write(chunk); });
      child.stderr.on('data', (chunk) => log.write(chunk));
      child.on('error', reject);
      child.on('close', (code) => code === 0 ? resolve() : reject(new Error(`${name} exited ${code}; see ${path.relative(root, evidence)}/${name}.log`)));
    });
    return stdout;
  } finally {
    await new Promise((resolve) => log.end(resolve));
  }
}

async function checkArtifact() {
  await run('pnpm', ['--filter', '@bubbasfw/ui', 'build'], root, 'build-package');
  const packed = JSON.parse(await run('npm', ['pack', '--json', '--ignore-scripts', '--pack-destination', evidence], ui, 'pack'))[0];
  const names = packed.files.map(({ path: name }) => name);
  const tarball = path.join(evidence, packed.filename);
  const unpacked = path.join(evidence, 'artifact');
  await mkdir(unpacked);
  await run('tar', ['-xzf', tarball, '-C', unpacked], root, 'unpack');
  const publishedRoot = path.join(unpacked, 'package');
  const manifest = JSON.parse(await readFile(path.join(publishedRoot, 'package.json'), 'utf8'));
  for (const peer of ['react', 'react-native', 'react-native-web', 'nativewind', 'tailwindcss']) {
    assert.equal(typeof manifest.peerDependencies[peer], 'string', `${peer} must remain a peer`);
    assert.ok(!manifest.dependencies?.[peer], `${peer} must not be bundled as a normal dependency`);
  }
  assert.equal(manifest.name, '@bubbasfw/ui');
  assert.equal(manifest.publishConfig.access, 'public');
  assert.notEqual(manifest.private, true);
  assert.ok(names.some((name) => name.startsWith('src/') && name.endsWith('.tsx')), 'Consumers need published class sources');
  assert.ok(!names.some((name) => /(^|\/)(node_modules|examples|artifacts|\.env|\.git)(\/|$)/.test(name)));
  const visit = (entry) => {
    if (typeof entry === 'string') assert.ok(names.includes(entry.replace(/^\.\//, '')), `Missing export ${entry}`);
    else Object.values(entry).forEach(visit);
  };
  Object.values(manifest.exports).forEach(visit);
  for (const name of names.filter((name) => name.startsWith('src/') && /\.tsx?$/.test(name))) {
    const source = await readFile(path.join(publishedRoot, name), 'utf8');
    assert.doesNotMatch(source, /<(?:div|button|input|textarea|select|span|a)(?:\s|>)/, `Native package source must not render HTML: ${name}`);
    assert.doesNotMatch(source, /(?:from|require\()\s*["'](?:@base-ui|@radix-ui)/, `No web-only primitive dependency: ${name}`);
  }
  for (const file of ['dist/index.js', 'dist/index.cjs']) {
    const source = await readFile(path.join(publishedRoot, file), 'utf8');
    assert.match(source, /nativewind\/jsx-runtime/, 'Compiled components must retain NativeWind JSX handling');
    assert.match(source, /["']react-native["']/, 'React Native must remain external');
    assert.match(source, /["']use client["']/, 'Next.js must retain the component client boundary');
  }
  const require = createRequire(path.join(publishedRoot, 'package.json'));
  const preset = require(path.join(publishedRoot, 'tailwind-preset.cjs'));
  assert.ok(preset.theme?.extend?.colors, 'The published Tailwind preset must load');
  const { tokens } = require(path.join(publishedRoot, 'dist/tokens.cjs'));
  assert.equal(tokens.colors.red, '#CC0000', 'The platform-neutral token export must load');
  assert.equal(Object.keys(tokens.themes.light).length, 41, 'Complete light semantic role map');
  assert.deepEqual(Object.keys(tokens.themes.light).sort(), Object.keys(tokens.themes.dark).sort(), 'Both themes cover the same semantic roles');
  report.checks.artifact = { filename: packed.filename, files: names, bytes: packed.size, shasum: packed.shasum, integrity: packed.integrity };
  return tarball;
}

async function prepareConsumer(name, tarball) {
  const destination = path.join(fixtures, name);
  await cp(path.join(root, 'examples', name), destination, {
    recursive: true,
    filter: (source) => !['node_modules', '.next', '.expo', 'dist-native', 'dist-web'].includes(path.basename(source)) && !source.endsWith('.tsbuildinfo'),
  });
  const manifestPath = path.join(destination, 'package.json');
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  manifest.dependencies['@bubbasfw/ui'] = `file:${tarball}`;
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  // A fixture-owned workspace isolates installation from the source workspace
  // and gives pnpm 11 an explicit, narrowly scoped native build policy.
  await writeFile(path.join(destination, 'pnpm-workspace.yaml'), 'packages: []\nallowBuilds:\n  esbuild: true\n  sharp: true\nstrictPeerDependencies: true\n');
  await run('pnpm', ['install', '--no-frozen-lockfile'], destination, `${name}-install`);
  await run('pnpm', ['run', 'typecheck'], destination, `${name}-typecheck`);
  return destination;
}

async function freePort() {
  const server = createServer();
  await new Promise((resolve, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', resolve); });
  const port = server.address().port;
  await new Promise((resolve) => server.close(resolve));
  return port;
}

async function checkNext(directory) {
  await run('pnpm', ['run', 'build'], directory, 'next-build');
  const port = await freePort();
  const url = `http://127.0.0.1:${port}`;
  const require = createRequire(path.join(directory, 'package.json'));
  const log = createWriteStream(path.join(evidence, 'next-server.log'));
  const server = spawn(process.execPath, [require.resolve('next/dist/bin/next'), 'start', '--hostname', '127.0.0.1', '--port', String(port)], { cwd: directory, env, stdio: ['ignore', 'pipe', 'pipe'] });
  server.stdout.pipe(log, { end: false });
  server.stderr.pipe(log, { end: false });
  const exited = new Promise((resolve) => server.once('exit', resolve));
  try {
    let ready = false;
    for (let attempt = 0; attempt < 120 && server.exitCode === null; attempt += 1) {
      try { ready = (await fetch(url)).ok; } catch { /* Wait for the owned server. */ }
      if (ready) break;
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
    assert.ok(ready, 'The packed Next.js consumer must start');
    report.checks.next = { productionBuild: true, web: await verifyWeb(url, evidence) };
  } finally {
    if (server.exitCode === null) {
      server.kill('SIGTERM');
      await Promise.race([exited, new Promise((resolve) => setTimeout(resolve, 10000))]);
      if (server.exitCode === null) { server.kill('SIGKILL'); await exited; }
    }
    await new Promise((resolve) => log.end(resolve));
  }
}

try {
  const tarball = await checkArtifact();
  if (!process.argv.includes('--artifact-only')) {
    if (!process.argv.includes('--native-only')) {
      const next = await prepareConsumer('next', tarball);
      await checkNext(next);
    }
    const expo = await prepareConsumer('expo', tarball);
    await run('pnpm', ['run', 'export:native'], expo, 'expo-native-export');
    const metadata = JSON.parse(await readFile(path.join(expo, 'dist-native/metadata.json'), 'utf8'));
    assert.ok(metadata.fileMetadata?.ios, 'iOS bundle metadata must exist');
    assert.ok(metadata.fileMetadata?.android, 'Android bundle metadata must exist');
    const bundles = {};
    for (const platform of ['ios', 'android']) {
      const file = metadata.fileMetadata[platform].bundle;
      const bytes = await readFile(path.join(expo, 'dist-native', file));
      assert.ok(bytes.length > 0, `${platform} bundle must contain bytes`);
      bundles[platform] = { file, bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex') };
    }
    report.checks.expo = { iosBundle: true, androidBundle: true, metadata, bundles };
  }
  report.status = 'passed';
} catch (error) {
  report.status = 'failed';
  report.error = error.stack;
  process.exitCode = 1;
} finally {
  if (report.status === 'passed') await rm(fixtures, { recursive: true, force: true });
  else report.failedFixtures = path.relative(root, fixtures);
  await writeFile(path.join(evidence, 'report.json'), `${JSON.stringify(report, null, 2)}\n`);
  console.log(`${report.status}: ${path.relative(root, evidence)}/report.json`);
  if (report.error) console.error(report.error);
}
