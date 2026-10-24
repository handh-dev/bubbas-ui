// Exact inputs for the supported web package path. This is not a general cache.
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {readFile,lstat} from 'node:fs/promises';
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
 assert.deepEqual(receipt.productionIdentity?.members,current.members,'Package production inputs changed since original archive production');
 assert.equal(receipt.productionIdentity?.contentSha256,current.contentSha256,'Package production contents changed');
 return receipt;
}
export async function validateQualification(root,archive,reportFile){
 const report=JSON.parse(await readFile(reportFile,'utf8'));
 assert.equal(report.schemaVersion,1,'Unsupported qualification report');
 assert.equal(report.kind,'bubbas-ui-package');assert.equal(report.policy,policy);
 assert.equal(report.mode,'web','Web qualification mode required');assert.equal(report.status,'passed','Completed passing qualification required');
 assert.equal(report.cleanup,'complete','Owned cleanup must complete');
 for(const name of requiredChecks)assert.equal(report.checks?.[name]?.status,'passed',`Missing required web outcome: ${name}`);
 assert.equal(report.archive.sha256,sha(await readFile(archive)),'Qualified original archive differs');
 assert.deepEqual(report.verificationIdentity,await sourceIdentity(root),'Source contents changed since qualification');
 assert.deepEqual(report.tools,toolsIdentity(),'Required package tools changed');
 return report;
}
