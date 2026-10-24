import {test} from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
function command(...args){return spawnSync(process.execPath,['scripts/verify-package.mjs',...args],{cwd:root,encoding:'utf8'});}
test('package command refuses conflicting modes before loading build or browser dependencies',()=>{
 const result=command('--web','--native-only');
 assert.notEqual(result.status,0);
 assert.match(result.stderr,/Conflicting qualification modes/);
});
test('web qualification requires the chosen original archive before starting work',()=>{
 const result=command('--web');
 assert.notEqual(result.status,0);
 assert.match(result.stderr,/--archive and --source-receipt are required/);
});
test('package command refuses unknown options and absent chosen archives before loading dependencies',()=>{
 for(const [args,message] of [[['--wat'],'Unknown argument'],[['--web','--archive','/missing.tgz','--source-receipt','/missing.json'],'ENOENT']]){
  const result=command(...args);assert.notEqual(result.status,0);assert.match(result.stderr,new RegExp(message));assert.doesNotMatch(result.stderr,/Cannot find package 'playwright'/);
 }
});

import {mkdtemp,mkdir,writeFile,readFile,copyFile,readdir,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {createHash} from 'node:crypto';
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
test('reuse refuses changed dirty source, supported untracked input, lock, archive, mode and unfinished outcomes through the package CLI',async()=>{
 const fixture=await mkdtemp(path.join(tmpdir(),'bubbas-package-reuse-'));
 async function put(file,value){await mkdir(path.dirname(path.join(fixture,file)),{recursive:true});await writeFile(path.join(fixture,file),value);}
 const git=(...args)=>{const r=spawnSync('git',args,{cwd:fixture,encoding:'utf8'});assert.equal(r.status,0,r.stderr);return r.stdout.trim();};
 const run=()=>spawnSync(process.execPath,['scripts/verify-package.mjs','--archive','original.tgz','--check-report','report.json'],{cwd:fixture,encoding:'utf8'});
 try{
  await mkdir(path.join(fixture,'scripts'));for(const file of ['verify-package.mjs','package-custody.mjs'])await copyFile(path.join(root,'scripts',file),path.join(fixture,'scripts',file));
  await put('package.json','{"type":"module"}');await put('packages/ui/src/example.ts','known dirty candidate A');await put('pnpm-lock.yaml','lock A');await put('original.tgz','known original bytes');
  git('init','--quiet');git('add','package.json');git('-c','user.name=Custody Test','-c','user.email=custody@example.invalid','commit','-qm','fixture');
  const files=['package.json','packages/ui/src/example.ts','pnpm-lock.yaml',...((await readdir(path.join(fixture,'scripts'))).map(file=>'scripts/'+file))].sort(),members={};for(const file of files)members[file]=sha(await readFile(path.join(fixture,file)));
  const report={schemaVersion:1,kind:'bubbas-ui-package',policy:'bubbas-ui-web-v1',mode:'web',status:'passed',cleanup:'complete',sourceIdentity:{commit:git('rev-parse','HEAD'),contentSha256:sha(JSON.stringify(members)),members},tools:{node:process.version,platform:process.platform,arch:process.arch,pnpm:spawnSync('pnpm',['--version'],{encoding:'utf8'}).stdout.trim()},archive:{sha256:sha('known original bytes')},checks:Object.fromEntries(['artifact','webConsumer','forms','websiteSections'].map(name=>[name,{status:'passed'}]))};
  report.verificationIdentity=report.sourceIdentity;await put('report.json',JSON.stringify(report));assert.equal(run().status,0);
  await put('packages/ui/src/example.ts','known dirty candidate B');assert.match(run().stderr,/Source contents changed/);await put('packages/ui/src/example.ts','known dirty candidate A');
  await put('packages/ui/src/untracked.ts','new supported input');assert.match(run().stderr,/Source contents changed/);await rm(path.join(fixture,'packages/ui/src/untracked.ts'));
  await put('pnpm-lock.yaml','lock B');assert.match(run().stderr,/Source contents changed/);await put('pnpm-lock.yaml','lock A');
  await put('original.tgz','package-json-only substitute');assert.match(run().stderr,/Qualified original archive differs/);await put('original.tgz','known original bytes');
  for(const [change,message]of [[{mode:'artifact'},/Web qualification mode required/],[{status:'running'},/Completed passing qualification required/],[{checks:{}},/Missing required web outcome/],[{tools:{...report.tools,node:'v0.0.0'}},/Required package tools changed/]]){await put('report.json',JSON.stringify({...report,...change}));assert.match(run().stderr,message);}
 }finally{await rm(fixture,{recursive:true,force:true});}
});
