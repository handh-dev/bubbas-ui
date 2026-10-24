// Actual original-archive command: cancel at its retained final browser evidence.
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {spawn,execFileSync} from 'node:child_process';
import {readdir,stat,readFile,writeFile,mkdir} from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..'),archive=process.env.BUBBAS_UI_ARCHIVE,source=process.env.BUBBAS_UI_SOURCE_RECEIPT;
const failure=process.env.BUBBAS_PACKAGE_FAILURE??'cancel';
test(`${failure} original-archive qualification cannot publish passing proof`,{skip:!archive||!source,timeout:150000},async()=>{
 await mkdir(path.join(root,'.local'),{recursive:true});const base=path.join(root,'artifacts/verification'),before=new Set(await readdir(base));
 const child=spawn(process.execPath,['scripts/verify-package.mjs','--web','--archive',archive,'--source-receipt',source],{cwd:root,stdio:['ignore','pipe','pipe']});let output='',directory,signalled=false,serverPid;
 child.stdout.on('data',b=>output+=b);child.stderr.on('data',b=>output+=b);const exited=new Promise((r,j)=>{child.once('error',j);child.once('close',code=>r(code));});
 try{
  for(let i=0;i<6500&&child.exitCode===null&&child.signalCode===null;i++){
   if(!directory){const dirs=(await readdir(base)).filter(name=>!before.has(name)&&name.startsWith('web-'));if(dirs.length)directory=path.join(base,dirs[0]);}
   if(directory&&failure==='server-exit'&&!serverPid){try{const log=await readFile(path.join(directory,'next-server.log'),'utf8');const port=log.match(/Local:\s+http:\/\/127\.0\.0\.1:(\d+)/)?.[1];if(port){const pid=Number(execFileSync('lsof',[`-tiTCP:${port}`,'-sTCP:LISTEN'],{encoding:'utf8'}).trim());if(Number(execFileSync('ps',['-p',String(pid),'-o','ppid='],{encoding:'utf8'}).trim())===child.pid)serverPid=pid;}}catch{}}
   if(directory){let written=false;try{await stat(path.join(directory,'web.json'));written=true;}catch{}if(written&&(failure!=='server-exit'||serverPid)){if(failure==='server-exit')process.kill(serverPid,'SIGKILL');else child.kill('SIGTERM');signalled=true;break;}}
   await new Promise(r=>setTimeout(r,15));
  }
  const code=await exited;assert.ok(signalled,'The actual Next browser screenshot phase must be reached');
  const report=JSON.parse(await readFile(path.join(directory,'report.json'),'utf8'));
  await writeFile(path.join(root,'.local/package-cancellation-result.json'),JSON.stringify({failure,code,signalled,report:directory,status:report.status,cleanup:report.cleanup,authority:false},null,2)+'\n');
  assert.notEqual(report.status,'passed','Cancelled work cannot authorize adoption');assert.notEqual(code,0);assert.equal(report.cleanup,'complete');
 }finally{if(child.exitCode===null&&child.signalCode===null){child.kill('SIGTERM');await exited;}await writeFile(path.join(root,'.local/package-cancellation.log'),output);}
});
