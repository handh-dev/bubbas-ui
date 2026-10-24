import assert from 'node:assert/strict';
import {execFileSync,spawn} from 'node:child_process';
import {createWriteStream} from 'node:fs';
import {mkdir,mkdtemp,readFile,writeFile,rm,cp,readdir,lstat} from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';
import {createServer} from 'node:net';
import {policy,sha,sourceIdentity,toolsIdentity,validateSourceReceipt,validateQualification} from './package-custody.mjs';
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
 const report={schemaVersion:1,kind:'bubbas-ui-package',policy,mode:'web',status:'running',sourceIdentity:production.sourceIdentity,verificationIdentity:await sourceIdentity(root),productionIdentity:production.productionIdentity,productionTools:production.tools,tools:toolsIdentity(),archive:{...production.archive},productionReceiptSha256:sha(await readFile(sourceReceipt)),command:'node scripts/verify-package.mjs --web --archive ORIGINAL --source-receipt SOURCE',checks:{},cleanup:'pending'};
 const reportFile=path.join(evidence,'report.json');await writeFile(reportFile,JSON.stringify(report,null,2)+'\n');
 try{
  const {packageRoot,members,version}=await inspectArchive(archive,path.join(evidence,'artifact'));
  report.archive={...report.archive,version,members};report.checks.artifact={status:'passed'};
  // Node resolution from the extracted artifact uses the producer's exact installed tools.
  const {symlink}=await import('node:fs/promises');await symlink(path.join(root,'packages/ui/node_modules'),path.join(packageRoot,'node_modules'),'dir');
  await ownedRun(process.execPath,['scripts/verify-web-forms.mjs',packageRoot,path.join(evidence,'forms')],root,evidence,'forms');report.checks.forms={status:'passed'};
  await ownedRun(process.execPath,['scripts/verify-website-sections.mjs','--package-root',packageRoot,'--evidence',path.join(evidence,'sections')],root,evidence,'sections');report.checks.websiteSections={status:'passed'};
  const next=path.join(consumers,'next');await cp(path.join(root,'examples/next'),next,{recursive:true,filter:file=>!['node_modules','.next'].includes(path.basename(file))&&!file.endsWith('.tsbuildinfo')});
  const manifest=JSON.parse(await readFile(path.join(next,'package.json'),'utf8'));manifest.dependencies['@bubbasfw/ui']=`file:${archive}`;await writeFile(path.join(next,'package.json'),JSON.stringify(manifest,null,2)+'\n');
  await writeFile(path.join(next,'pnpm-workspace.yaml'),'packages: []\nallowBuilds:\n  esbuild: true\n  sharp: true\nstrictPeerDependencies: true\n');
  await ownedRun('pnpm',['install','--no-frozen-lockfile'],next,evidence,'web-install');await ownedRun('pnpm',['typecheck'],next,evidence,'web-typecheck');await ownedRun('pnpm',['build'],next,evidence,'web-build');
  await checkNext(next,evidence);report.checks.webConsumer={status:'passed',entry:'@bubbasfw/ui/web',productionBuild:true,typecheck:true,browser:true};
  assert.equal(sha(await readFile(archive)),production.archive.sha256,'Original archive changed during qualification');
  assert.deepEqual(await sourceIdentity(root),report.verificationIdentity,'Source contents changed during qualification');assert.deepEqual(toolsIdentity(),report.tools,'Tools changed during qualification');
  report.status='passed';
 }catch(error){report.status='failed';report.error=error.stack;process.exitCode=1;}
 finally{
  try{await rm(consumers,{recursive:true,force:true});await rm(path.join(evidence,'artifact'),{recursive:true,force:true});report.cleanup='complete';}catch(error){report.cleanup='failed';report.status='failed';report.error=error.stack;process.exitCode=1;}
  await writeFile(reportFile,JSON.stringify(report,null,2)+'\n');console.log(`${report.status}: ${reportFile}`);if(report.error)console.error(report.error);
 }
}
async function checkNext(directory,evidence){
 const portServer=createServer();await new Promise(resolve=>portServer.listen(0,'127.0.0.1',resolve));const port=portServer.address().port;await new Promise(resolve=>portServer.close(resolve));
 const require=createRequire(path.join(directory,'package.json'));const log=createWriteStream(path.join(evidence,'next-server.log'));
 const child=spawn(process.execPath,[require.resolve('next/dist/bin/next'),'start','--hostname','127.0.0.1','--port',String(port)],{cwd:directory,detached:true,stdio:['ignore','pipe','pipe']});child.stdout.pipe(log,{end:false});child.stderr.pipe(log,{end:false});
 const stop=()=>{try{process.kill(-child.pid,'SIGTERM');}catch{}};process.once('SIGINT',stop);process.once('SIGTERM',stop);
 const exited=new Promise(resolve=>child.once('close',resolve));
 try{
  let ready=false;for(let i=0;i<100&&child.exitCode===null;i++){try{ready=(await fetch(`http://127.0.0.1:${port}`,{signal:AbortSignal.timeout(1000)})).ok;}catch{}if(ready)break;await new Promise(resolve=>setTimeout(resolve,300));}assert.ok(ready,'Packed web consumer must start');
  const {verifyWeb}=await import('./verify-web.mjs');await verifyWeb(`http://127.0.0.1:${port}`,evidence);
 }finally{stop();await Promise.race([exited,new Promise(resolve=>setTimeout(resolve,10000))]);try{process.kill(-child.pid,'SIGKILL');}catch{}await exited;process.removeListener('SIGINT',stop);process.removeListener('SIGTERM',stop);await new Promise(resolve=>log.end(resolve));}
}
