import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
export async function verifyStaticFonts(root) {
  const fonts = path.join(root, 'examples/expo/assets/fonts');
  const manifest = JSON.parse(await readFile(path.join(fonts, 'native/manifest.json'), 'utf8'));
  const source = await readFile(path.join(fonts, 'montserrat.ttf'));
  assert.equal(sha(source), manifest.source.sha256);
  assert.equal(sha(await readFile(path.join(fonts, 'OFL.txt'))), manifest.license.sha256);
  assert.equal(manifest.license.identifier, 'OFL-1.1');
  assert.deepEqual(manifest.files.map(file => file.weight), [400, 500, 600, 700, 900]);
  for (const file of manifest.files) {
    const bytes = await readFile(path.join(fonts, 'native', file.path));
    assert.equal(bytes.length, file.bytes); assert.equal(sha(bytes), file.sha256);
    const tables = {};
    for (let i = 0; i < bytes.readUInt16BE(4); i++) {
      const start = 12 + i * 16;
      tables[bytes.toString('ascii', start, start + 4)] = bytes.readUInt32BE(start + 8);
    }
    assert.equal(tables.fvar, undefined, 'SDK 57 native face must be static');
    assert.equal(bytes.readUInt16BE(tables['OS/2'] + 4), file.weight);
    const name = tables.name, count = bytes.readUInt16BE(name + 2), storage = name + bytes.readUInt16BE(name + 4);
    const names = [];
    for (let i = 0; i < count; i++) {
      const start = name + 6 + i * 12;
      if (bytes.readUInt16BE(start) !== 3) continue;
      const id = bytes.readUInt16BE(start + 6), length = bytes.readUInt16BE(start + 8), offset = bytes.readUInt16BE(start + 10);
      const data = Buffer.from(bytes.subarray(storage + offset, storage + offset + length));
      names.push({ id, value: data.swap16().toString('utf16le') });
    }
    assert.ok(names.some(item => [1, 16].includes(item.id) && item.value === file.family), 'Native Montserrat family metadata');
    assert.ok(names.some(item => item.id === 6 && item.value === file.postScriptName), 'Exact iOS PostScript face');
  }
  const paths = manifest.files.map(file => ({ path: `./assets/fonts/native/${file.path}`, weight: file.weight, style: 'normal' }));
  assert.deepEqual(JSON.parse(await readFile(path.join(root, 'examples/expo/native-fonts.json'), 'utf8')), {
    android: { fonts: [{ fontFamily: 'BubbasBody', fontDefinitions: paths }] }, ios: { fonts: paths.map(file => file.path) },
  });
  return { staticWeights: manifest.files.map(file => file.weight), hashesAndLicense: true, nativeWeightAndPostScriptMetadata: true,
    androidXmlFamilyContract: true, iosEmbeddedFamilyContract: true, scope: 'Source font bytes and plugin input only; native generated resources and installed face paint require separate checks' };
}
