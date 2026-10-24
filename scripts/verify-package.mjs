import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {execFileSync,spawn} from 'node:child_process';
import {createWriteStream,writeFileSync,renameSync} from 'node:fs';
import {mkdir,mkdtemp,readFile,writeFile,rm,cp,readdir,lstat} from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';
import {createServer} from 'node:net';
import {policy,sha,sourceIdentity,toolsIdentity,validateSourceReceipt,validateQualification,testInputIdentity,consumerToolIdentity} from './package-custody.mjs';
const root=path.resolve(import.meta.dirname,'..');
const flags=new Map();const booleans=new Set(['--web','--artifact-only','--native-only','--legacy-full','--pack']);
try{
 for(let i=2;i<process.argv.length;i++){
  const key=process.argv[i];assert.ok(booleans.has(key)||['--archive','--source-receipt','--check-report','--destination'].includes(key),`Unknown argument: ${key}`);
  assert.ok(!flags.has(key),`Duplicate argument: ${key}`);
  if(booleans.has(key))flags.set(key,true);else{const value=process.argv[++i];assert.ok(value&&!value.startsWith('--'),`Missing value: ${key}`);flags.set(key,value);}
 }
 const modes=[...booleans].filter(key=>flags.has(key));assert.ok(modes.length<=1,'Conflicting qualification modes');
 if(modes.some(key=>['--artifact-only','--native-only','--legacy-full'].includes(key))){
  assert.equal(flags.size,1,'Historical qualification accepts only its explicit mode');
  process.argv=process.argv.slice(0,2).concat(modes[0]==='--legacy-full'?[]:[modes[0]]);
  await import('./verify-package-legacy.mjs');
 }else if(flags.has('--pack')){
  assert.ok(flags.has('--destination')&&flags.size===2,'Use --pack --destination DIRECTORY');
  await pack(path.resolve(flags.get('--destination')));
 }else{
  assert.ok(flags.has('--archive')&&(flags.has('--source-receipt')||flags.has('--check-report')),'--archive and --source-receipt are required (or --check-report for reuse)');
  assert.ok(!flags.has('--destination'),'--destination is only for original archive production');
  assert.ok(!(flags.has('--source-receipt')&&flags.has('--check-report')),'Choose source receipt or completed report');
  const archive=path.resolve(flags.get('--archive'));
  if(flags.has('--check-report')){await validateQualification(root,archive,path.resolve(flags.get('--check-report')));console.log('Current original-archive web qualification passed');}
  else await qualify(archive,path.resolve(flags.get('--source-receipt')));
 }
}catch(error){console.error(error.stack);process.exitCode=1;}

async function ownedRun(command,args,cwd,evidence,name){
 const log=createWriteStream(path.join(evidence,`${name}.log`));log.write(`$ ${command} ${args.join(' ')}\n`);
 let output='';let child;let interrupted=false;let killTimer;
 const stop=()=>{interrupted=true;if(child?.pid){try{process.kill(-child.pid,'SIGTERM');}catch{}killTimer??=setTimeout(()=>{try{process.kill(-child.pid,'SIGKILL');}catch{}},10000);killTimer.unref();}};
 process.once('SIGINT',stop);process.once('SIGTERM',stop);
 try{
  await new Promise((resolve,reject)=>{
   child=spawn(command,args,{cwd,env:{...process.env,CI:'1',NEXT_TELEMETRY_DISABLED:'1',EXPO_NO_TELEMETRY:'1'},detached:true,stdio:['ignore','pipe','pipe']});
   child.stdout.on('data',bytes=>{output+=bytes;log.write(bytes);});child.stderr.on('data',bytes=>log.write(bytes));
   child.once('error',reject);child.once('close',code=>code===0&&!interrupted?resolve():reject(new Error(`${name} ${interrupted?'interrupted':`exited ${code}`}; see ${evidence}`)));
  });return output;
 }finally{
  if(child?.pid){
   const alive=()=>{try{process.kill(-child.pid,0);return true;}catch{return false;}};
   if(alive()){
    try{process.kill(-child.pid,'SIGTERM');}catch{}
    const deadline=Date.now()+10000;
    while(alive()&&Date.now()<deadline)await new Promise(resolve=>setTimeout(resolve,100));
    if(alive())try{process.kill(-child.pid,'SIGKILL');}catch{}
   }
  }
  clearTimeout(killTimer);process.removeListener('SIGINT',stop);process.removeListener('SIGTERM',stop);await new Promise(resolve=>log.end(resolve));
 }
}
async function pack(destination){
 await mkdir(destination,{recursive:true});
 const evidence=await mkdtemp(path.join(destination,'production-'));
 const before=await sourceIdentity(root),productionIdentity=await sourceIdentity(root,true),tools=toolsIdentity();
 const receipt={schemaVersion:1,kind:'bubbas-ui-original-archive',policy,status:'running',sourceIdentity:before,productionIdentity,tools};
 const receiptFile=path.join(evidence,'source.json');await writeFile(receiptFile,JSON.stringify(receipt,null,2)+'\n');
 try{
  await ownedRun('pnpm',['build'],root,evidence,'build');
  const [packed]=JSON.parse(await ownedRun('npm',['pack','--json','--ignore-scripts','--pack-destination',evidence],path.join(root,'packages/ui'),evidence,'pack-once'));
  const archive=path.join(evidence,packed.filename);receipt.archive={filename:packed.filename,sha256:sha(await readFile(archive)),bytes:(await readFile(archive)).length};
  assert.deepEqual(await sourceIdentity(root),before,'Source changed while producing original archive');receipt.status='passed';
  console.log(JSON.stringify({archive,sourceReceipt:receiptFile,...receipt.archive}));
 }catch(error){receipt.status='failed';receipt.error=error.stack;throw error;}finally{await writeFile(receiptFile,JSON.stringify(receipt,null,2)+'\n');}
}
async function inspectArchive(archive,destination){
 const names=execFileSync('tar',['-tzf',archive],{encoding:'utf8',maxBuffer:8*1024*1024}).trim().split('\n');
 assert.ok(names.length<2000&&new Set(names).size===names.length,'Archive member limit or duplicate');
 for(const name of names)assert.ok(name.startsWith('package/')&&!name.split('/').some(part=>part==='..')&&!name.includes('\\'),'Unsafe archive path');
 const listing=execFileSync('tar',['-tvzf',archive],{encoding:'utf8',maxBuffer:8*1024*1024}).trim().split('\n');
 assert.ok(listing.every(line=>/^[-d]/.test(line)),'Archive may contain only regular files/directories');
 await mkdir(destination);execFileSync('tar',['-xzf',archive,'-C',destination]);
 const packageRoot=path.join(destination,'package'),members={};
 for(const name of (await readdir(packageRoot,{recursive:true})).sort()){
  const file=path.join(packageRoot,name),stat=await lstat(file);assert.ok(!stat.isSymbolicLink(),'No package symlinks');
  if(stat.isFile())members[name]=sha(await readFile(file));
 }
 const manifest=JSON.parse(await readFile(path.join(packageRoot,'package.json'),'utf8'));
 assert.equal(manifest.name,'@bubbasfw/ui');assert.equal(manifest.bubba.releaseContract,'web-only-v1','New web contract required');
 assert.ok(!Object.keys(members).some(name=>/\.(ttf|otf|woff2?|png|jpe?g|webp)$/i.test(name)),'No private font/art binaries');
 const visit=entry=>{if(typeof entry==='string')assert.ok(members[entry.replace(/^\.\//,'')],`Missing export ${entry}`);else Object.values(entry).forEach(visit);};Object.values(manifest.exports).forEach(visit);
 for(const file of ['dist/web.js','dist/web.browser.js']){const bytes=await readFile(path.join(packageRoot,file),'utf8');assert.match(bytes,/react-native-web/);assert.doesNotMatch(bytes,/from ["']react-native["']|require\(["']react-native["']\)/);}
 const lock=JSON.parse(await readFile(path.join(packageRoot,'foundations.lock.json'),'utf8'));
 assert.equal(manifest.bubba.foundationDigest,sha(await readFile(path.join(packageRoot,'foundations/foundations.json'))));
 assert.equal(manifest.bubba.sourceCommit,lock.sourceCommit);
 const foundationBytes=await readFile(path.join(packageRoot,'foundations/manifest.json'));
 assert.equal(sha(foundationBytes),lock.manifestSha256,'Packed foundation manifest differs from immutable lock');
 const foundation=JSON.parse(foundationBytes);assert.equal(foundation.scope,'public-safe');assert.equal(foundation.source.commit,lock.sourceCommit);
 for(const file of foundation.files){
  assert.ok(!file.path.includes('..')&&!path.isAbsolute(file.path),'Unsafe foundation member');
  const bytes=await readFile(path.join(packageRoot,'foundations',file.path));assert.equal(sha(bytes),file.sha256);assert.equal(bytes.length,file.bytes);
  assert.equal(file.distribution,'public-safe');assert.equal(file.approval.status,'approved');assert.equal(file.rights.public_distribution,true);
 }
 for(const name of ['LICENSE','web/NOTICE.md','web/NATIVEWIND-LICENSE','web/REACT-NATIVE-WEB-LICENSE','foundations/NOTICE.txt'])assert.ok(members[name],`Missing source/rights notice ${name}`);
 return{packageRoot,members,version:manifest.version};
}
async function qualify(archive,sourceReceipt){
 // Fail custody before framework/browser imports, installation, or output mutation.
 const production=await validateSourceReceipt(root,archive,sourceReceipt);
 const base=path.join(root,'artifacts/verification');await mkdir(base,{recursive:true});
 const evidence=await mkdtemp(path.join(base,'web-'));const consumers=path.join(evidence,'consumers');
 const report={schemaVersion:1,kind:'bubbas-ui-package',policy,mode:'web',status:'running',sourceIdentity:production.sourceIdentity,verificationIdentity:await sourceIdentity(root),productionIdentity:production.productionIdentity,productionTools:production.tools,tools:toolsIdentity(),archive:{...production.archive},testInputs:await testInputIdentity(),productionReceiptSha256:sha(await readFile(sourceReceipt)),command:'node scripts/verify-package.mjs --web --archive ORIGINAL --source-receipt SOURCE',checks:{},cleanup:'pending'};
 const reportFile=path.join(evidence,'report.json');await writeFile(reportFile,JSON.stringify(report,null,2)+'\n');
 let interrupted=false;const markInterrupted=()=>{interrupted=true;};process.on('SIGINT',markInterrupted);process.on('SIGTERM',markInterrupted);
 const active=()=>assert.ok(!interrupted,'Package qualification interrupted');
 const run=async(...values)=>{active();const result=await ownedRun(...values);active();return result;};
 try{
  const {packageRoot,members,version}=await inspectArchive(archive,path.join(evidence,'artifact'));
  report.archive={...report.archive,version,members};report.checks.artifact={status:'passed'};
  // Node resolution from the extracted artifact uses the producer's exact installed tools.
  const {symlink}=await import('node:fs/promises');await symlink(path.join(root,'packages/ui/node_modules'),path.join(packageRoot,'node_modules'),'dir');
  await run(process.execPath,['scripts/verify-web-forms.mjs',packageRoot,path.join(evidence,'forms')],root,evidence,'forms');const forms=JSON.parse(await readFile(path.join(evidence,'forms/report.json'),'utf8'));assert.equal(forms.browserVersion,report.testInputs.browser.version);report.checks.forms={status:'passed',browserVersion:forms.browserVersion};
  await run(process.execPath,['scripts/verify-website-sections.mjs','--package-root',packageRoot,'--evidence',path.join(evidence,'sections')],root,evidence,'sections');const sections=JSON.parse(await readFile(path.join(evidence,'sections/report.json'),'utf8'));assert.equal(sections.browserVersion,report.testInputs.browser.version);report.checks.websiteSections={status:'passed',browserVersion:sections.browserVersion};
  const next=path.join(consumers,'next');await cp(path.join(root,'examples/next'),next,{recursive:true,filter:file=>!['node_modules','.next'].includes(path.basename(file))&&!file.endsWith('.tsbuildinfo')});
  const manifest=JSON.parse(await readFile(path.join(next,'package.json'),'utf8'));const consumerArchive='bubbasfw-ui-original.tgz';await cp(archive,path.join(next,consumerArchive));assert.equal(sha(await readFile(path.join(next,consumerArchive))),production.archive.sha256);manifest.dependencies['@bubbasfw/ui']=`file:./${consumerArchive}`;await writeFile(path.join(next,'package.json'),JSON.stringify(manifest,null,2)+'\n');
  await writeFile(path.join(next,'pnpm-workspace.yaml'),'packages: []\nallowBuilds:\n  esbuild: true\n  sharp: true\nstrictPeerDependencies: true\n');
  await run('pnpm',['install','--no-frozen-lockfile'],next,evidence,'web-install');
  const lockContents=await readFile(path.join(next,'pnpm-lock.yaml'),'utf8');
  report.consumer={manifestSha256:sha(await readFile(path.join(next,'package.json'))),lockContents,lockSha256:sha(lockContents),tools:await consumerToolIdentity(next)};
  assert.ok(!lockContents.includes(root),'Consumer lock must use portable original-archive paths');await writeFile(path.join(evidence,'next-consumer.pnpm-lock.yaml'),lockContents);
  await run('pnpm',['typecheck'],next,evidence,'web-typecheck');await run('pnpm',['build'],next,evidence,'web-build');
  const consumerOutcome=await checkNext(next,evidence);active();assert.equal(consumerOutcome.browserVersion,report.testInputs.browser.version,'Actual browser differs from recorded engine');report.checks.webConsumer={status:'passed',entry:'@bubbasfw/ui/web',productionBuild:true,typecheck:true,browser:true,lifecycle:consumerOutcome.lifecycle};
  assert.equal(sha(await readFile(archive)),production.archive.sha256,'Original archive changed during qualification');
  assert.deepEqual(await sourceIdentity(root),report.verificationIdentity,'Source contents changed during qualification');assert.deepEqual(toolsIdentity(),report.tools,'Tools changed during qualification');assert.deepEqual(await testInputIdentity(),report.testInputs,'Browser or external fixture changed during qualification');
  active();report.status='passed';
 }catch(error){report.status=interrupted?'interrupted':'failed';report.error=error.stack;process.exitCode=1;}
 finally{
  try{await rm(consumers,{recursive:true,force:true});await rm(path.join(evidence,'artifact'),{recursive:true,force:true});report.cleanup='complete';}catch(error){report.cleanup='failed';report.status='failed';report.error=error.stack;process.exitCode=1;}
  if(interrupted){report.status='interrupted';process.exitCode=1;}
  report.completion=report.status==='passed'&&report.cleanup==='complete'?'uninterrupted-cleanup-v1':'incomplete';
  // Publication is the completion point: no asynchronous gap can publish a
  // pre-cancellation status after cancellation was observed during cleanup.
  const pending=reportFile+'.complete';writeFileSync(pending,JSON.stringify(report,null,2)+'\n');renameSync(pending,reportFile);
  process.removeListener('SIGINT',markInterrupted);process.removeListener('SIGTERM',markInterrupted);console.log(`${report.status}: ${reportFile}`);if(report.error)console.error(report.error);
 }
}
async function checkNext(directory,evidence){
 const portServer=createServer();await new Promise(resolve=>portServer.listen(0,'127.0.0.1',resolve));const port=portServer.address().port;await new Promise(resolve=>portServer.close(resolve));
 const require=createRequire(path.join(directory,'package.json')),runtimeId=randomUUID(),controller=new AbortController();
 const log=createWriteStream(path.join(evidence,'next-server.log'));
 const child=spawn(process.execPath,['--import',path.join(root,'scripts/package-consumer-runtime.mjs'),require.resolve('next/dist/bin/next'),'start','--hostname','127.0.0.1','--port',String(port)],{cwd:directory,env:{...process.env,BUBBAS_PACKAGE_RUNTIME_ID:runtimeId},detached:true,stdio:['ignore','pipe','pipe']});child.stdout.pipe(log,{end:false});child.stderr.pipe(log,{end:false});
 const exited=new Promise((resolve,reject)=>{child.once('error',reject);child.once('close',resolve);});
 let interrupted=false,expectedStop=false,unexpected,killTimer,outcome;
 const alive=()=>child.exitCode===null&&child.signalCode===null;
 const guard=()=>assert.ok(alive()&&!unexpected,'Packed Next candidate exited prematurely');
 const terminate=()=>{if(alive()){try{process.kill(-child.pid,'SIGTERM');}catch{}killTimer??=setTimeout(()=>{if(alive())try{process.kill(-child.pid,'SIGKILL');}catch{}},10000);killTimer.unref();}};
 const cancel=()=>{interrupted=true;controller.abort(new Error('Packed Next qualification interrupted'));terminate();};
 process.on('SIGINT',cancel);process.on('SIGTERM',cancel);
 const premature=exited.then(()=>{if(!expectedStop){unexpected=new Error('Packed Next candidate exited prematurely');controller.abort(unexpected);throw unexpected;}});premature.catch(()=>{});
 const runtimeFile=path.join(evidence,'next-runtime.json');
 const health=async()=>{guard();const response=await fetch(`http://127.0.0.1:${port}`,{signal:AbortSignal.timeout(1000)});guard();assert.equal(response.headers.get('x-bubbas-package-consumer'),runtimeId,'Packed Next readiness belongs to another runtime');return response.ok;};
 try{
  await writeFile(runtimeFile,JSON.stringify({kind:'bubbas-ui-next-runtime',status:'running',runtimeId,childPid:child.pid,url:`http://127.0.0.1:${port}`},null,2)+'\n');
  let ready=false;for(let i=0;i<100&&!interrupted;i++){guard();try{ready=await health();}catch(error){if(error.cause?.code!=='ECONNREFUSED'&&!['TimeoutError','AbortError'].includes(error.name))throw error;}if(ready)break;await new Promise(resolve=>setTimeout(resolve,300));}
  assert.ok(ready&&!interrupted,'Packed Next candidate must become ready');
  const {verifyWeb}=await import('./verify-web.mjs');outcome=await Promise.race([verifyWeb(`http://127.0.0.1:${port}`,evidence,{signal:controller.signal}),premature]);
  guard();assert.ok(!interrupted&&await health(),'Packed Next qualification interrupted or unavailable');
 }finally{
  expectedStop=true;controller.abort(new Error('Owned Next cleanup'));terminate();
  try{await exited;await writeFile(runtimeFile,JSON.stringify({kind:'bubbas-ui-next-runtime',status:interrupted?'interrupted':unexpected||!outcome?'failed':'stopped',runtimeId,exitCode:child.exitCode,signal:child.signalCode,cleanup:alive()?'failed':'complete'},null,2)+'\n');}finally{clearTimeout(killTimer);process.removeListener('SIGINT',cancel);process.removeListener('SIGTERM',cancel);await new Promise(resolve=>log.end(resolve));}
 }
 assert.ok(!interrupted&&!unexpected,'Packed Next qualification interrupted or exited prematurely');
 assert.ok(child.exitCode===0||child.signalCode==='SIGTERM','Packed Next candidate did not stop successfully');
 const lifecycle={runtimeId,ownedReadiness:true,uninterrupted:true,cleanup:'complete',exitCode:child.exitCode,signal:child.signalCode};
 await writeFile(runtimeFile,JSON.stringify({kind:'bubbas-ui-next-runtime',status:'stopped',...lifecycle},null,2)+'\n');
 return{browserVersion:outcome.browserVersion,lifecycle};
}
