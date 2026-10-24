// Exact inputs for the supported web package path. This is not a general cache.
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {readFile,lstat} from 'node:fs/promises';
import {createReadStream} from 'node:fs';
import {createRequire} from 'node:module';
import path from 'node:path';
export const policy='bubbas-ui-web-v1';
export const requiredChecks=['artifact','webConsumer','forms','websiteSections'];
export const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
export async function sourceIdentity(root,production=false){
 const scope=production?['package.json','pnpm-lock.yaml','pnpm-workspace.yaml','packages/ui','scripts/build-web.mjs','scripts/foundations.mjs','scripts/shadcn-theme.mjs']:['package.json','pnpm-lock.yaml','pnpm-workspace.yaml','packages/ui','scripts','examples/next','apps/docs'];
 const files=execFileSync('git',['ls-files','--cached','--others','--exclude-standard','-z','--',...scope],{cwd:root}).toString().split('\0').filter(Boolean).sort();
 const members={};
 for(const name of new Set(files)){
  const file=path.join(root,name);let stat;try{stat=await lstat(file);}catch(error){if(error.code==='ENOENT'){members[name]='deleted';continue;}throw error;}
  assert.ok(stat.isFile()&&!stat.isSymbolicLink(),`Regular source input required: ${name}`);
  members[name]=sha(await readFile(file));
 }
 return{commit:execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim(),contentSha256:sha(JSON.stringify(members)),members};
}
export function toolsIdentity(){return{node:process.version,platform:process.platform,arch:process.arch,pnpm:execFileSync('pnpm',['--version'],{encoding:'utf8'}).trim()};}
export async function validateSourceReceipt(root,archive,receiptFile){
 const receipt=JSON.parse(await readFile(receiptFile,'utf8'));
 assert.equal(receipt.schemaVersion,1,'Unsupported source receipt');
 assert.equal(receipt.kind,'bubbas-ui-original-archive');
 assert.equal(receipt.status,'passed','Incomplete original archive production');
 assert.equal(receipt.policy,policy);
 assert.equal(receipt.archive.sha256,sha(await readFile(archive)),'Original archive differs from production receipt');
 const current=await sourceIdentity(root,true);
 assert.equal(receipt.productionIdentity?.contentSha256,sha(JSON.stringify(receipt.productionIdentity?.members)),'Original production snapshot is incomplete');
 // The original records its original builder/helper inputs. A later verifier or
 // importer correction does not rewrite that custody or require repacking it.
 // Proposed package content must still be exactly the original packaged source.
 const packaged=members=>Object.fromEntries(Object.entries(members??{}).filter(([name])=>name.startsWith('packages/ui/')));
 const originalPackage=packaged(receipt.productionIdentity.members);assert.ok(Object.keys(originalPackage).length,'Original package source snapshot absent');
 assert.deepEqual(packaged(current.members),originalPackage,'Package production contents changed since original archive production');
 return receipt;
}
export async function validateQualification(root,archive,reportFile){
 const report=JSON.parse(await readFile(reportFile,'utf8'));
 assert.equal(report.schemaVersion,1,'Unsupported qualification report');
 assert.equal(report.kind,'bubbas-ui-package');assert.equal(report.policy,policy);
 assert.equal(report.mode,'web','Web qualification mode required');assert.equal(report.status,'passed','Completed passing qualification required');
 assert.equal(report.cleanup,'complete','Owned cleanup must complete');
 assert.equal(report.completion,'uninterrupted-cleanup-v1','Uninterrupted package completion required');
 for(const name of requiredChecks)assert.equal(report.checks?.[name]?.status,'passed',`Missing required web outcome: ${name}`);
 const lifecycle=report.checks?.webConsumer?.lifecycle;
 assert.ok(lifecycle?.ownedReadiness===true&&lifecycle.uninterrupted===true&&lifecycle.cleanup==='complete'&&((lifecycle.exitCode===0&&lifecycle.signal===null)||(lifecycle.exitCode===null&&lifecycle.signal==='SIGTERM')),'Successful owned consumer lifecycle required');
 assert.equal(report.archive.sha256,sha(await readFile(archive)),'Qualified original archive differs');
 assert.deepEqual(report.verificationIdentity,await sourceIdentity(root),'Source contents changed since qualification');
 assert.deepEqual(report.tools,toolsIdentity(),'Required package tools changed');
 assert.ok(report.consumer?.lockContents&&report.consumer?.lockSha256,'Resolved consumer lock is required');
 assert.equal(sha(report.consumer.lockContents),report.consumer.lockSha256,'Resolved consumer lock differs');
 assert.ok(report.consumer.manifestSha256&&report.consumer.tools?.next&&report.consumer.tools?.typescript,'Resolved consumer tools are required');
 assert.deepEqual(report.consumer.tools,await consumerToolIdentity(path.join(root,'examples/next')),'Required consumer tools changed');
 const inputs=await testInputIdentity();
 assert.deepEqual(report.testInputs?.mapPinFixture,inputs.mapPinFixture,'External map fixture changed');
 assert.deepEqual(report.testInputs?.browser,inputs.browser,'Required browser changed');
 return report;
}

async function fileSha256(file){const hash=createHash('sha256');for await(const chunk of createReadStream(file))hash.update(chunk);return hash.digest('hex');}
export async function testInputIdentity(){
 const require=createRequire(import.meta.url),{chromium}=await import('playwright');
 const playwrightFile=require.resolve('playwright/package.json');
 const playwright=JSON.parse(await readFile(playwrightFile,'utf8'));
 const coreRoot=path.dirname(createRequire(playwrightFile).resolve('playwright-core/package.json'));
 const metadata=JSON.parse(await readFile(path.join(coreRoot,'browsers.json'),'utf8')).browsers.find(item=>item.name==='chromium');
 const executable=chromium.executablePath(),engineFiles={launcher:await fileSha256(executable)};
 if(process.platform==='darwin')engineFiles.framework=await fileSha256(path.resolve(path.dirname(executable),'../Frameworks/Google Chrome for Testing Framework.framework/Versions/Current/Google Chrome for Testing Framework'));
 if(process.platform==='win32')engineFiles.engine=await fileSha256(path.join(path.dirname(executable),'chrome.dll'));
 const browser={playwright:playwright.version,name:'chromium',version:metadata.browserVersion,revision:metadata.revision,engineFiles};
 const fixture=process.env.MAP_PIN_FIXTURE;
 let mapPinFixture={kind:'builtin-synthetic'};
 if(fixture){const stat=await lstat(fixture);assert.ok(stat.isFile()&&!stat.isSymbolicLink(),'Regular external map fixture required');mapPinFixture={kind:'external',sha256:await fileSha256(fixture),bytes:stat.size};}
 return{browser,mapPinFixture};
}

export async function consumerToolIdentity(directory){
 const require=createRequire(path.join(directory,'package.json')),tools={};
 for(const name of ['next','typescript']){const file=require.resolve(`${name}/package.json`),bytes=await readFile(file);tools[name]={version:JSON.parse(bytes).version,packageSha256:sha(bytes)};}
 return tools;
}
