import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFile,realpath} from 'node:fs/promises';
import path from 'node:path';
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
/** Fail before bundling if a fixture points at a different original candidate. */
export async function browserArtifactIdentity(packageRoot){
 const root=await realpath(packageRoot);let identity;
 try{identity=JSON.parse(await readFile(path.resolve(root,'../..','identity.json'),'utf8'));}catch(error){if(error.code!=='ENOENT')throw error;}
 const expected=process.env.MARKETING_EXPECTED_ARCHIVE_SHA256,source=process.env.MARKETING_EXPECTED_SOURCE;
 if(expected||source)assert.ok(identity,'Expected original artifact identity beside the extracted package');
 if(identity){
  assert.equal(sha(await readFile(identity.archive)),identity.sha256,'Original archive identity changed');
  if(expected)assert.equal(identity.sha256,expected,'Wrong original archive selected');
  if(source)assert.equal(identity.sourceCommit,source,'Wrong source candidate selected');
  for(const member of identity.members)assert.equal(sha(await readFile(path.join(root,member.path))),member.sha256,`Extracted member changed: ${member.path}`);
 }
 return{packageRoot:root,sourceCommit:identity?.sourceCommit??null,archiveSha256:identity?.sha256??null,browserModuleSha256:sha(await readFile(path.join(root,'dist/web.browser.js'))),serverModuleSha256:sha(await readFile(path.join(root,'dist/web.js')))};
}
export async function assertBrowserBundle(result,identity,workingDirectory){
 const expected=await realpath(path.join(identity.packageRoot,'dist/web.browser.js'));
 const entries=[];for(const input of Object.keys(result.metafile.inputs)){if(input.endsWith('/dist/web.browser.js'))entries.push(await realpath(path.resolve(workingDirectory,input)));}
 assert.deepEqual(entries,[expected],'Fixture must bundle exactly the asserted candidate browser module');
 return{...identity,bundledBrowserModule:expected};
}
