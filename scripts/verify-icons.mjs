import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {inflateSync} from 'node:zlib';
const root = new URL('../packages/ui/', import.meta.url);
const manifest=JSON.parse(await readFile(new URL('icons/manifest.json',root),'utf8'));
assert.equal(manifest.lucide,'lucide-static@1.61.0');
assert.equal(manifest.simpleIcons,'simple-icons@16.35.0');
const generated=await readFile(new URL('src/internal/icon-sources.ts',root),'utf8');
const sources=JSON.parse(generated.slice(generated.indexOf(' = ')+3,generated.lastIndexOf(' as const;')));
assert.deepEqual(Object.keys(sources),Object.keys(manifest.icons));
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
for(const [name,entry] of Object.entries(manifest.icons)) {
 assert.match(entry.source,/^(lucide|simple-icons|original)\/[a-z0-9-]+\.svg$/);
 assert.equal(hash(await readFile(new URL('icons/'+entry.source,root))),entry.sourceSha256);
 const png=Buffer.from(sources[name].split(',')[1],'base64');
 assert.equal(hash(png),entry.pngSha256);
 const decoded=decodeIcon(png);assert.ok(decoded.coverage>.025,`${name} must have visible ink`);
 if(name==='money')assert.ok(greenInkFraction(decoded)>.3,'Green banknote paper must occupy a prominent area of the actual raster, not a tiny accent');
 assert.equal(entry.width,96); assert.equal(entry.height,96);
}
const money=await readFile(new URL('icons/original/money.svg',root),'utf8');
assert.deepEqual([...new Set(money.match(/#[0-9A-F]{6}/g))].sort(),['#03256C','#23633F','#43A969','#8BD8A4','#FFFFFF'],'Original money clipart uses green banknote paper with navy outlines and white detail');
for(const file of ['lucide/LICENSE','simple-icons/LICENSE.md','original/NOTICE.md']) assert.ok((await readFile(new URL('icons/'+file,root),'utf8')).length>100);
console.log('Pinned icon subset sources, licenses and generated native/web image hashes verified.');

// Decode only the committed RGBA PNG format; reject empty rasterized vectors.
export function decodeIcon(png) {
 assert.equal(png.readUInt32BE(16),96); assert.equal(png.readUInt32BE(20),96);
 assert.equal(png[24],8); assert.equal(png[25],6);
 let offset=8, chunks=[]; while(offset<png.length) {const length=png.readUInt32BE(offset),type=png.toString('ascii',offset+4,offset+8);if(type==='IDAT')chunks.push(png.subarray(offset+8,offset+8+length));offset+=12+length;}
 const raw=inflateSync(Buffer.concat(chunks)),stride=384,rows=Buffer.alloc(stride*96);let total=0;
 for(let y=0;y<96;y++){const filter=raw[y*(stride+1)];for(let x=0;x<stride;x++){const i=y*stride+x,a=x>=4?rows[i-4]:0,b=y?rows[i-stride]:0,c=y&&x>=4?rows[i-stride-4]:0;let predict=0;if(filter===1)predict=a;else if(filter===2)predict=b;else if(filter===3)predict=Math.floor((a+b)/2);else if(filter===4){const p=a+b-c,pa=Math.abs(p-a),pb=Math.abs(p-b),pc=Math.abs(p-c);predict=pa<=pb&&pa<=pc?a:pb<=pc?b:c;}else assert.equal(filter,0);rows[i]=(raw[y*(stride+1)+1+x]+predict)&255;if(x%4===3)total+=rows[i];}}
 return {coverage:total/(96*96*255),pixels:rows};
}

export function greenInkFraction(decoded) {
 let green=0,ink=0;for(let i=0;i<decoded.pixels.length;i+=4){const[r,g,b,a]=decoded.pixels.subarray(i,i+4),weight=a/255;ink+=weight;if(g>r+20&&g>b+12)green+=weight;}return green/ink;
}
