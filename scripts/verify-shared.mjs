import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
// Catalog hosts must consume the package implementation, never own specimen copies.
for (const host of ['apps/docs/src', 'examples/next', 'examples/expo']) {
  for (const name of await readdir(`${host}/showcase`)) {
    if (!/\.(tsx?|jsx?)$/.test(name)) continue;
    const source = await readFile(`${host}/showcase/${name}`, 'utf8');
    assert.match(source, /from ["']@bubbasfw\/ui["']/, `${host}/${name} must use canonical package examples`);
    assert.doesNotMatch(source, /(?:className\s*=|<[A-Za-z]|\bfunction\s)/, `${host}/${name} must not duplicate the catalog implementation`);
  }
}
console.log('Canonical package catalog ownership verified across docs and both examples.');
