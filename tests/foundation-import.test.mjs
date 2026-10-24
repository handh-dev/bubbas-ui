import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,copyFile,cp,writeFile,readFile,rm} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import {tmpdir} from 'node:os';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..'),source=process.env.BUBBAS_FOUNDATION_SOURCE_REPO;
test('reviewed foundation import preserves package-owned release metadata',{skip:!source},async()=>{
 const fixture=await mkdtemp(path.join(tmpdir(),'bubbas-foundation-import-'));
 try{
  await mkdir(path.join(fixture,'scripts'));await copyFile(path.join(root,'scripts/foundations.mjs'),path.join(fixture,'scripts/foundations.mjs'));
  await mkdir(path.join(fixture,'packages/ui/src'),{recursive:true});await cp(path.join(root,'packages/ui/foundations'),path.join(fixture,'packages/ui/foundations'),{recursive:true});await copyFile(path.join(root,'packages/ui/foundations.lock.json'),path.join(fixture,'packages/ui/foundations.lock.json'));
  await writeFile(path.join(fixture,'packages/ui/package.json'),JSON.stringify({name:'@bubbasfw/ui',bubba:{releaseContract:'web-only-v1',packageAnnotation:'retained-package-note',systemVersion:'stale-foundation-field',sourceCommit:'0'.repeat(40)}}));
  const result=spawnSync(process.execPath,['scripts/foundations.mjs','--import',path.join(root,'packages/ui/foundations'),'--source-repo',source],{cwd:fixture,encoding:'utf8'});assert.equal(result.status,0,result.stderr);
  const pkg=JSON.parse(await readFile(path.join(fixture,'packages/ui/package.json'),'utf8'));assert.equal(pkg.bubba.releaseContract,'web-only-v1');assert.equal(pkg.bubba.packageAnnotation,'retained-package-note');assert.equal(pkg.bubba.systemVersion,'0.5.0');assert.equal(pkg.bubba.sourceCommit,'31be2db4c6626f5a48d871d6a7a27bac8b7a04b9');
  const check=spawnSync(process.execPath,['scripts/foundations.mjs','--check'],{cwd:fixture,encoding:'utf8'});assert.equal(check.status,0,check.stderr);
 }finally{await rm(fixture,{recursive:true,force:true});}
});
