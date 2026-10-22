import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const root = new URL('../packages/ui/', import.meta.url);
const manifest=JSON.parse(await readFile(new URL('icons/manifest.json',root),'utf8'));
assert.equal(manifest.lucide,'lucide-static@1.61.0');
assert.equal(manifest.simpleIcons,'simple-icons@16.35.0');
const generated=await readFile(new URL('src/internal/icon-sources.ts',root),'utf8');
const sources=JSON.parse(generated.slice(generated.indexOf(' = ')+3,generated.lastIndexOf(' as const;')));
assert.deepEqual(Object.keys(sources),Object.keys(manifest.icons));
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
for(const [name,entry] of Object.entries(manifest.icons)) {
 assert.match(entry.source,/^(lucide|simple-icons)\/[a-z-]+\.svg$/);
 assert.equal(hash(await readFile(new URL('icons/'+entry.source,root))),entry.sourceSha256);
 assert.equal(hash(Buffer.from(sources[name].split(',')[1],'base64')),entry.pngSha256);
 assert.equal(entry.width,96); assert.equal(entry.height,96);
}
for(const file of ['lucide/LICENSE','simple-icons/LICENSE.md']) assert.ok((await readFile(new URL('icons/'+file,root),'utf8')).length>100);
console.log('Pinned icon subset sources, licenses and generated native/web image hashes verified.');
