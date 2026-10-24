import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { cp, lstat, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ui = path.join(root, 'packages/ui');
const vendor = path.join(ui, 'foundations');
const expected = ['NOTICE.txt', 'foundations.css', 'foundations.json', 'foundations.mjs', 'tailwind.cjs'];
const sha = (bytes) => createHash('sha256').update(bytes).digest('hex');
const json = async (file) => JSON.parse(await readFile(file, 'utf8'));
const contrast = (fg, bg) => {
  const luminance = (hex) => [1, 3, 5].map((n) => parseInt(hex.slice(n, n + 2), 16) / 255)
    .map((n) => n <= .04045 ? n / 12.92 : ((n + .055) / 1.055) ** 2.4)
    .reduce((sum, n, i) => sum + n * [.2126, .7152, .0722][i], 0);
  const [a, b] = [luminance(fg), luminance(bg)].sort((a, b) => b - a);
  return (a + .05) / (b + .05);
};

// Independently derive adapters from the schema. A refreshed checksum alone
// cannot make arbitrary/stale generated CSS or executable JavaScript valid.
function adapters(source) {
  const canonical = JSON.stringify(source, null, 2);
  const esm = '// Generated from Brand Studio foundations; do not edit.\n'
    + '/** @typedef {"light" | "dark"} BubbaAppearance */\n'
    + '/** @typedef {' + Object.keys(source.role_types).map((key) => JSON.stringify(key)).join(' | ') + '} BubbaRole */\n'
    + `export const foundations = ${canonical};\nexport const systemVersion = foundations.version;\nexport const themes = foundations.themes;\nexport default foundations;\n`;
  const config = { theme: { extend: {
    colors: { bubba: Object.fromEntries(Object.entries(source.role_types).filter(([, kind]) => kind === 'color').map(([name]) => [name, `var(--bubba-ui-${name})`])) },
    spacing: Object.fromEntries(Object.entries(source.spacing).map(([name, value]) => [`bubba-${name}`, `${value}px`])),
    borderRadius: Object.fromEntries(Object.entries(source.radii).map(([name, value]) => [`bubba-${name}`, `${value}px`])),
    fontFamily: Object.fromEntries(Object.entries(source.typography).map(([name, value]) => [name, value.family.split(', ')])),
  } } };
  const lines = [`/* bubbas ${source.version} — versioned foundations; original artwork remains unchanged. */`, ':root {'];
  for (const [group, prefix, unit] of [['colors', 'color', ''], ['spacing', 'space', 'px'], ['radii', 'radius', 'px']])
    for (const [name, value] of Object.entries(source[group])) lines.push(`  --bubba-${prefix}-${name}: ${value}${unit};`);
  for (const name of ['body', 'display']) {
    const [family, ...fallback] = source.typography[name].family.split(',');
    lines.push(`  --bubba-font-${name}: ${JSON.stringify(family.trim())},${fallback.join(',')};`);
  }
  for (const role of source.type_scale) for (const [field, suffix] of [['mobile_px', 'mobile'], ['desktop_px', 'desktop']])
    lines.push(`  --bubba-type-${role.role.toLowerCase().replaceAll(' / ', '-').replaceAll(' ', '-')}-${suffix}: ${role[field]}px;`);
  const display = source.type_scale.find((role) => role.role === 'Display');
  lines.push(`  --bubba-type-display-weight: ${display.weight};`, `  --bubba-type-display-line-height: ${display.line_height};`);
  for (const [group, prefix] of [['effects', 'effect'], ['shadows', 'shadow']])
    for (const [name, value] of Object.entries(source[group])) lines.push(`  --bubba-${prefix}-${name}: ${value};`);
  lines.push(`  --bubba-motion-feedback: ${source.motion.feedback_ms}ms;`, `  --bubba-target-minimum: ${source.targets.minimum_px}px;`,
    `  --bubba-target-default: ${source.targets.default_px}px;`, `  --bubba-focus-width: ${source.focus.width_px}px;`, '}', '');
  for (const theme of ['light', 'dark']) {
    lines.push((theme === 'light' ? ':root, [data-bubba-theme="light"]' : '[data-bubba-theme="dark"]') + ' {', `  color-scheme: ${theme};`);
    for (const [name, value] of Object.entries(source.themes[theme])) lines.push(`  --bubba-ui-${name}: ${value};`);
    lines.push('}', '');
  }
  lines.push('@media (prefers-reduced-motion: reduce) {', '  :root { --bubba-motion-feedback: 0ms; }', '}', '');
  const notice = 'Bubba’s Fireworks design system — software foundations\n'
    + 'Owner-authorized system source distribution, 22 October 2026.\n'
    + 'Brand Studio owns reviewed identity and foundations; Core owns business facts.\n'
    + 'The immutable approved asset release remains 1.0.0. This export contains no\n'
    + 'artwork or font binary. Preserve original logo geometry and source inks.\n'
    + 'Montserrat is SIL Open Font License 1.1; keep OFL.txt with any font binary.\n'
    + 'Eurostile and rights-incomplete private artwork are excluded. Availability of a\n'
    + 'private asset is not permission to distribute it. Generated art stays private\n'
    + 'and draft until human approval; these software exports do not approve artwork.\n'
    + 'Pin system version, source commit, foundation digest and every member checksum.\n'
    + 'No running Brand Studio dependency is required or permitted in consumer builds.\n';
  return { 'foundations.mjs': esm, 'tailwind.cjs': `// Generated from Brand Studio foundations.\nmodule.exports = ${JSON.stringify(config, null, 2)};\n`, 'foundations.css': lines.join('\n') + (source.recipes?.web?.css ?? ''), 'NOTICE.txt': notice };
}

async function validate(directory) {
  assert.ok((await lstat(directory)).isDirectory(), 'Release directory must be a real directory');
  for (const name of [...expected, 'manifest.json']) assert.ok((await lstat(path.join(directory, name))).isFile(), `${name}: regular file required`);
  const manifestBytes = await readFile(path.join(directory, 'manifest.json'));
  const manifest = JSON.parse(manifestBytes);
  assert.equal(manifest.schemaVersion, 1);
  assert.equal(manifest.scope, 'public-safe');
  assert.equal(manifest.source.repository, 'https://github.com/handh-dev/bubbas-brand-studio');
  assert.equal(manifest.source.path, 'design-system/tokens.json');
  assert.match(manifest.source.commit, /^[0-9a-f]{40}$/);
  assert.deepEqual(manifest.files.map((file) => file.path).sort(), expected);
  assert.deepEqual((await readdir(directory)).sort(), [...expected, 'manifest.json'].sort());
  for (const entry of manifest.files) {
    assert.equal(entry.distribution, 'public-safe', entry.path);
    assert.equal(entry.approval?.status, 'approved', `${entry.path}: approval required`);
    assert.equal(entry.rights?.public_distribution, true, `${entry.path}: distribution rights required`);
    assert.ok(entry.rights.license && entry.approval.source);
    const bytes = await readFile(path.join(directory, entry.path));
    assert.equal(sha(bytes), entry.sha256, `${entry.path}: checksum mismatch`);
    assert.equal(bytes.length, entry.bytes, `${entry.path}: size mismatch`);
  }
  const foundationBytes = await readFile(path.join(directory, 'foundations.json'));
  assert.equal(sha(foundationBytes), manifest.foundationDigest);
  const source = JSON.parse(foundationBytes);
  assert.equal(source.schema_version, 1);
  assert.equal(source.version, manifest.systemVersion);
  assert.equal(source.brand_release, manifest.brandRelease);
  assert.ok(manifest.brandSources.length > 0);
  assert.equal(new Set(manifest.brandSources.map((asset) => asset.id)).size, manifest.brandSources.length);
  for (const asset of manifest.brandSources) {
    assert.equal(asset.approval?.status, 'approved', `${asset.id}: approved identity required`);
    assert.equal(asset.rights?.public_distribution, true, `${asset.id}: public rights required`);
    assert.match(asset.sha256, /^[0-9a-f]{64}$/);
    assert.equal(asset.version, manifest.brandRelease);
  }
  for (const [name, expectedBytes] of Object.entries(adapters(source))) assert.equal(await readFile(path.join(directory, name), 'utf8'), expectedBytes, `${name}: canonical derivation mismatch`);
  assert.equal(source.type_scale.length, 6);
  for (const theme of Object.values(source.themes)) for (const role of ['primary', 'on-primary', 'primary-hover', 'content', 'overlay']) assert.ok(theme[role], `Missing canonical alias ${role}`);
  assert.deepEqual(Object.keys(source.themes.light).sort(), Object.keys(source.themes.dark).sort());
  assert.deepEqual(Object.keys(source.role_types).sort(), Object.keys(source.themes.light).sort());
  assert.ok(source.focus.width_px >= 2 && source.motion.reduced_motion_ms === 0);
  const hex = /^#[0-9a-f]{6}$/i;
  for (const [name, theme] of Object.entries(source.themes)) {
    for (const [role, value] of Object.entries(theme)) if (!role.startsWith('shadow-')) assert.match(value, hex, `${name}.${role}`);
    for (const pair of source.theme_contrast_pairs) {
      assert.ok(theme[pair.foreground] && theme[pair.background], `${name}: unknown contrast role`);
      assert.ok(contrast(theme[pair.foreground], theme[pair.background]) >= pair.minimum, `${name}: ${pair.usage}`);
    }
    for (const surface of ['canvas', 'surface', 'raised', 'hover', 'selected']) {
      assert.ok(contrast(theme.focus, theme[surface]) >= 3, `${name}: focus on ${surface}`);
      for (const role of ['text', 'heading', 'muted', 'link']) assert.ok(contrast(theme[role], theme[surface]) >= 4.5, `${name}: ${role} on ${surface}`);
    }
    assert.equal(theme.content, theme.text);
    assert.equal(theme['on-primary'], theme['action-text']);
    assert.ok(contrast(theme['on-primary'], theme.primary) >= 4.5, `${name}: primary label contrast`);
    assert.ok(contrast(theme.border, theme.surface) >= 3, `${name}: control boundary contrast`);
  }
  for (const pair of source.contrast_pairs) assert.ok(contrast(pair.foreground, pair.background) >= pair.minimum, pair.usage);
  assert.ok(source.targets.minimum_px >= 44 && source.targets.default_px >= 48);
  assert.ok(source.motion.feedback_ms > 0 && source.motion.feedback_ms <= 200);
  assert.match(source.motion.reduced_motion, /disable|remove/i);
  return { manifest, source, manifestSha256: sha(manifestBytes) };
}

function verifyCommittedSource(validated) {
  const sourceIndex = process.argv.indexOf('--source-repo');
  assert.ok(sourceIndex !== -1, 'Import/validation requires --source-repo for committed-source verification');
  const sourceRepo = path.resolve(process.argv[sourceIndex + 1]);
  const git = (args) => execFileSync('git', ['-C', sourceRepo, ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  assert.equal(git(['remote', 'get-url', 'origin']).trim().replace(/\.git$/, ''), validated.manifest.source.repository);
  const committed = git(['show', `${validated.manifest.source.commit}:${validated.manifest.source.path}`]);
  assert.equal(sha(Buffer.from(committed)), validated.manifest.foundationDigest, 'Foundation differs from the exact committed source');
  const catalog = JSON.parse(git(['show', `${validated.manifest.source.commit}:catalog/assets.json`]));
  const approvedSources = catalog.assets.filter((asset) => asset.public_safe).map((asset) => Object.fromEntries(['id', 'version', 'sha256', 'approval', 'rights'].map((key) => [key, asset[key]])));
  assert.deepEqual(validated.manifest.brandSources, approvedSources, 'Brand sources differ from the committed approved catalog');
}

function generate({ source, manifest }) {
  const colors = source.colors;
  const data = {
    brandVersion: source.brand_release, systemVersion: source.version,
    foundationDigest: manifest.foundationDigest, sourceCommit: manifest.source.commit,
    colors: { blue: colors['brand-blue'], red: colors.action, redHover: colors['action-hover'], navy: colors.heading,
      night: '#001845', ink: colors.ink, muted: colors.muted, line: colors.line, white: colors.surface,
      gold: colors.accent, disabled: source.themes.light['disabled-surface'], disabledText: source.themes.light['disabled-text'] },
    spacing: source.spacing, radius: source.radii,
    touchTarget: { minimum: source.targets.minimum_px, default: source.targets.default_px },
    layout: { maxWidth: source.layout.max_width, readingWidth: source.layout.reading_width, gutters: source.layout.gutters,
      breakpoints: { compact: source.layout.breakpoints[0], wide: source.layout.breakpoints[1] } },
    motion: { feedback: source.motion.feedback_ms, reducedMotion: source.motion.reduced_motion },
    typography: source.typography, typeScale: source.type_scale, colorRoles: source.color_roles,
    effects: source.effects, shadows: source.shadows, opacity: source.opacity, recipes: source.recipes, contrastPairs: source.contrast_pairs,
    themeContrastPairs: source.theme_contrast_pairs, themes: source.themes,
  };
  return `/** Generated from the pinned Brand Studio public-safe release. Run pnpm sync:foundations. */\nexport const tokens = ${JSON.stringify(data, null, 2)} as const;\n\nexport type BubbaTokens = typeof tokens;\n`;
}

const importIndex = process.argv.indexOf('--import');
const validateIndex = process.argv.indexOf('--validate');
if (validateIndex !== -1) {
  const validated = await validate(path.resolve(process.argv[validateIndex + 1]));
  verifyCommittedSource(validated);
  const { manifest } = validated;
  console.log(`Valid public-safe foundation ${manifest.systemVersion}: ${manifest.foundationDigest}`);
  process.exit(0);
}
if (importIndex !== -1) {
  const directory = path.resolve(process.argv[importIndex + 1]);
  const validated = await validate(directory);
  verifyCommittedSource(validated);
  await mkdir(vendor, { recursive: true });
  await cp(directory, vendor, { recursive: true });
  const lock = { schemaVersion: 1, systemVersion: validated.manifest.systemVersion, brandRelease: validated.manifest.brandRelease,
    foundationDigest: validated.manifest.foundationDigest, manifestSha256: validated.manifestSha256,
    sourceCommit: validated.manifest.source.commit };
  await writeFile(path.join(ui, 'foundations.lock.json'), `${JSON.stringify(lock, null, 2)}\n`);
  const packagePath = path.join(ui, 'package.json');
  const pkg = await json(packagePath);
  pkg.bubba = { ...pkg.bubba, systemVersion: lock.systemVersion, brandRelease: lock.brandRelease, foundationDigest: lock.foundationDigest, sourceCommit: lock.sourceCommit };
  await writeFile(packagePath, `${JSON.stringify(pkg, null, 2)}\n`);
}
const validated = await validate(vendor);
const lock = await json(path.join(ui, 'foundations.lock.json'));
for (const [key, value] of Object.entries({ schemaVersion: 1, systemVersion: validated.manifest.systemVersion,
  brandRelease: validated.manifest.brandRelease, foundationDigest: validated.manifest.foundationDigest,
  manifestSha256: validated.manifestSha256, sourceCommit: validated.manifest.source.commit })) assert.equal(lock[key], value, `Foundation lock ${key}`);
const manifest = await json(path.join(ui, 'package.json'));
assert.equal(manifest.bubba.systemVersion, lock.systemVersion, 'Package systemVersion gate');
assert.equal(manifest.bubba.brandRelease, lock.brandRelease, 'Package brandRelease gate');
assert.equal(manifest.bubba.foundationDigest, lock.foundationDigest, 'Package foundationDigest gate');
assert.equal(manifest.bubba.sourceCommit, lock.sourceCommit, 'Package sourceCommit gate');
const generated = generate(validated);
const target = path.join(ui, 'src/tokens.ts');
if (process.argv.includes('--check')) assert.equal(await readFile(target, 'utf8'), generated, 'Generated tokens stale: run pnpm sync:foundations');
else await writeFile(target, generated);
const publicDirectory = path.join(root, 'apps/docs/public/foundations');
if (process.argv.includes('--check')) {
  for (const file of [...expected, 'manifest.json']) assert.equal(sha(await readFile(path.join(publicDirectory, file))), sha(await readFile(path.join(vendor, file))), `Public foundation ${file} stale`);
} else {
  await mkdir(publicDirectory, { recursive: true });
  await cp(vendor, publicDirectory, { recursive: true });
}
console.log(`Foundation ${lock.systemVersion} / brand ${lock.brandRelease}: custody, rights, roles, contrast, targets, focus, motion and generated tokens verified.`);
