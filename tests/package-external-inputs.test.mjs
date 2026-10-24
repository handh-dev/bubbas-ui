// Optional actual-report reuse probes; no install, browser launch or archive mutation.
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {mkdtemp,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..'),archive=process.env.BUBBAS_UI_ARCHIVE,report=process.env.BUBBAS_UI_REPORT;
test('actual report reuse refuses a different external map fixture',{skip:!archive||!report},async()=>{
 const dir=await mkdtemp(path.join(tmpdir(),'bubbas-map-input-'));try{
  const fixture=path.join(dir,'pins.json');await writeFile(fixture,JSON.stringify([{id:'changed-external-fact',latitude:33,longitude:-96}]));
  const result=spawnSync(process.execPath,['scripts/verify-package.mjs','--archive',archive,'--check-report',report],{cwd:root,env:{...process.env,MAP_PIN_FIXTURE:fixture},encoding:'utf8'});
  assert.notEqual(result.status,0);assert.match(result.stderr,/External map fixture changed/);
 }finally{await rm(dir,{recursive:true,force:true});}
});
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
test('actual report reuse refuses a substituted resolved consumer lock',{skip:!archive||!report},async()=>{
 const dir=await mkdtemp(path.join(tmpdir(),'bubbas-lock-input-'));try{
  const value=JSON.parse(await readFile(report,'utf8'));value.consumer={...value.consumer,lockContents:'different resolved graph',lockSha256:sha('original resolved graph')};const file=path.join(dir,'report.json');await writeFile(file,JSON.stringify(value));
  const result=spawnSync(process.execPath,['scripts/verify-package.mjs','--archive',archive,'--check-report',file],{cwd:root,encoding:'utf8'});assert.notEqual(result.status,0);assert.match(result.stderr,/Resolved consumer lock differs/);
 }finally{await rm(dir,{recursive:true,force:true});}
});
test('actual report reuse refuses a different recorded browser engine',{skip:!archive||!report},async()=>{
 const dir=await mkdtemp(path.join(tmpdir(),'bubbas-browser-input-'));try{
  const value=JSON.parse(await readFile(report,'utf8'));value.testInputs={...value.testInputs,browser:{executableSha256:'0'.repeat(64)}};const file=path.join(dir,'report.json');await writeFile(file,JSON.stringify(value));
  const result=spawnSync(process.execPath,['scripts/verify-package.mjs','--archive',archive,'--check-report',file],{cwd:root,encoding:'utf8'});assert.notEqual(result.status,0);assert.match(result.stderr,/Required browser changed/);
 }finally{await rm(dir,{recursive:true,force:true});}
});
