// Compare painted defaults against immutable candidate14, rather than constants alone.
import assert from 'node:assert/strict';
import {writeFile,mkdir} from 'node:fs/promises';
import path from 'node:path';
import {chromium} from 'playwright';
import {createFocusMarqueeFixture} from './focus-marquee-fixture.mjs';
const out=path.resolve(process.env.FLOW_EVIDENCE??'artifacts/verification/focus-marquee-flow');
await mkdir(out,{recursive:true});
const expected={source:process.env.MARKETING_EXPECTED_SOURCE,sha:process.env.MARKETING_EXPECTED_ARCHIVE_SHA256};
process.env.MARKETING_EXPECTED_SOURCE='a19f7a7cf1f36f7665f2324cfac33e8534c43d09';
process.env.MARKETING_EXPECTED_ARCHIVE_SHA256='148cc3612850484d44b1470855904704795fc62dad1eff44b9ffff26b7f74cdd';
const baseline=await createFocusMarqueeFixture({packageRoot:'artifacts/releases/0.7.0-candidate14/extracted/package',preset:'spring',evidence:path.join(out,'baseline14')});
for(const [key,value]of Object.entries({MARKETING_EXPECTED_SOURCE:expected.source,MARKETING_EXPECTED_ARCHIVE_SHA256:expected.sha}))if(value===undefined)delete process.env[key];else process.env[key]=value;
process.env.MARKETING_EXPECTED_SOURCE='87adf83b5d7a460698836e51fabfbc93325d97df';
process.env.MARKETING_EXPECTED_ARCHIVE_SHA256='467da4ed840c93edd69ac3d286495505f8516e522567eddb23b938610c200805';
const previous=await createFocusMarqueeFixture({packageRoot:'artifacts/releases/0.7.0-candidate15/extracted/package',preset:'spring',evidence:path.join(out,'previous15')});
for(const [key,value]of Object.entries({MARKETING_EXPECTED_SOURCE:expected.source,MARKETING_EXPECTED_ARCHIVE_SHA256:expected.sha}))if(value===undefined)delete process.env[key];else process.env[key]=value;
const current=await createFocusMarqueeFixture({preset:'spring',evidence:path.join(out,'current17')});
let browser;const results=[],errors=[];
try{
 browser=await chromium.launch({headless:true});const page=await browser.newPage();page.on('pageerror',e=>errors.push(e.message));
 for(const width of[557,1661]){
  const pair={width};
  for(const [name,fixture]of[['baseline14',baseline],['previous15',previous],['current17',current]]){
   await page.setViewportSize({width,height:972});await page.goto(fixture.origin+'/?mode=real',{waitUntil:'networkidle'});await page.locator('[data-bubba-focus-active=true]').waitFor();
   const frames=await page.locator('.bubba-focus-marquee').evaluate(async(root,count)=>await new Promise(resolve=>{const frames=[];function sample(time){const r=root.getBoundingClientRect(),pills=[...root.querySelectorAll('.bubba-focus-item>.bubba-focus-pill')].map(p=>{const b=p.getBoundingClientRect();return{x:b.x,right:b.right,y:b.y,bottom:b.bottom,center:(b.x+b.right)/2-r.x-r.width/2,label:p.textContent,blur:parseFloat(getComputedStyle(p).filter.match(/blur\(([^p]+)/)?.[1]??'0')}}),nearest=[...pills].sort((a,b)=>Math.abs(a.center)-Math.abs(b.center))[0],visible=pills.filter(p=>p.right>r.x&&p.x<r.right);frames.push({time,x:new DOMMatrixReadOnly(getComputedStyle(root.querySelector('.bubba-focus-track')).transform).m41,period:root.querySelector('.bubba-focus-group').getBoundingClientRect().width,nearest,minGap:Math.min(...pills.slice(1).map((p,i)=>p.x-pills[i].right)),maxBlur:Math.max(...visible.map(p=>p.blur)),visible:visible.length,clipped:visible.some(p=>p.y<r.y-1||p.bottom>r.bottom+1)});if(frames.length<count)requestAnimationFrame(sample);else resolve(frames)}requestAnimationFrame(sample)}),name==='current17'?700:460);
   let quiet=0,longest=0;const centered=[],centeredTimes=[];for(let i=1;i<frames.length;i++){const f=frames[i],p=frames[i-1],delta=((f.x-p.x+f.period*1.5)%f.period)-f.period/2;if(f.nearest.label===p.nearest.label&&Math.abs(f.nearest.center)<.8&&Math.abs(delta)<.03)quiet+=(f.time-p.time)/1000;else{longest=Math.max(longest,quiet);quiet=0;}if(Math.abs(f.nearest.center)<.8&&centered.at(-1)!==f.nearest.label){centered.push(f.nearest.label);centeredTimes.push(f.time)}}longest=Math.max(longest,quiet);
   const intervals=centeredTimes.slice(1).map((time,index)=>(time-centeredTimes[index])/1000).sort((a,b)=>a-b);const medianInterval=intervals[Math.floor(intervals.length/2)];
   const sorted=frames.map(f=>f.minGap).sort((a,b)=>a-b);pair[name]={artifactIdentity:fixture.artifactIdentity,longestQuiet:longest,medianMinimumGap:sorted[Math.floor(sorted.length/2)],minimumGap:sorted[0],peakBlur:Math.max(...frames.map(f=>f.maxBlur)),medianInterval,centered,frames};
  }
  assert.ok(pair.current17.longestQuiet>=.10&&pair.current17.longestQuiet<=.23,'Observed quiet center rest is short');assert.ok(pair.baseline14.longestQuiet>.75&&pair.current17.longestQuiet<pair.baseline14.longestQuiet*.3,'Actual quiet rest is much shorter than14');assert.ok(pair.current17.medianMinimumGap<pair.baseline14.medianMinimumGap*.62,'Actual painted minimum gaps are substantially denser than14');assert.ok(pair.current17.minimumGap>=7,'Actual minimum configured gap remains separated');assert.ok(pair.current17.peakBlur<=1.01&&pair.current17.peakBlur<pair.baseline14.peakBlur*.4,'Actual outer blur is softer than14');assert.ok(pair.current17.medianInterval>=1.74&&pair.current17.medianInterval<=1.86,'Observed default interval is1.80s');assert.ok(pair.previous15.medianInterval>=.85&&pair.previous15.medianInterval<=.95&&pair.current17.medianInterval>pair.previous15.medianInterval*1.1,'Actual new interval follows the owner value versus immutable15');assert.ok(Math.abs(pair.current17.longestQuiet-pair.previous15.longestQuiet)<.06,'The short quiet rest is unchanged from15');assert.ok(Math.abs(pair.current17.medianMinimumGap-pair.previous15.medianMinimumGap)<3&&pair.current17.peakBlur===pair.previous15.peakBlur,'Density and soft blur are unchanged from15');assert.ok(pair.current17.centered.length>=6,'Default flows through all facts in sample');assert.ok(pair.current17.frames.every(f=>!f.clipped));results.push(pair);
 }
 assert.deepEqual(errors,[]);await writeFile(path.join(out,'report.json'),JSON.stringify({passed:true,results,errors},null,2));console.log('Actual default flow comparison passed: '+out);
}finally{await browser?.close();await Promise.all([baseline,previous,current].map(f=>new Promise(resolve=>f.server.close(resolve))));}
