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
const current=await createFocusMarqueeFixture({preset:'spring',evidence:path.join(out,'current15')});
let browser;const results=[],errors=[];
try{
 browser=await chromium.launch({headless:true});const page=await browser.newPage();page.on('pageerror',e=>errors.push(e.message));
 for(const width of[557,1661]){
  const pair={width};
  for(const [name,fixture]of[['baseline14',baseline],['current15',current]]){
   await page.setViewportSize({width,height:972});await page.goto(fixture.origin+'/?mode=real',{waitUntil:'networkidle'});await page.locator('[data-bubba-focus-active=true]').waitFor();
   const frames=await page.locator('.bubba-focus-marquee').evaluate(async root=>await new Promise(resolve=>{const frames=[];function sample(time){const r=root.getBoundingClientRect(),pills=[...root.querySelectorAll('.bubba-focus-item>.bubba-focus-pill')].map(p=>{const b=p.getBoundingClientRect();return{x:b.x,right:b.right,y:b.y,bottom:b.bottom,center:(b.x+b.right)/2-r.x-r.width/2,label:p.textContent,blur:parseFloat(getComputedStyle(p).filter.match(/blur\(([^p]+)/)?.[1]??'0')}}),nearest=[...pills].sort((a,b)=>Math.abs(a.center)-Math.abs(b.center))[0],visible=pills.filter(p=>p.right>r.x&&p.x<r.right);frames.push({time,x:new DOMMatrixReadOnly(getComputedStyle(root.querySelector('.bubba-focus-track')).transform).m41,period:root.querySelector('.bubba-focus-group').getBoundingClientRect().width,nearest,minGap:Math.min(...pills.slice(1).map((p,i)=>p.x-pills[i].right)),maxBlur:Math.max(...visible.map(p=>p.blur)),visible:visible.length,clipped:visible.some(p=>p.y<r.y-1||p.bottom>r.bottom+1)});if(frames.length<380)requestAnimationFrame(sample);else resolve(frames)}requestAnimationFrame(sample)}));
   let quiet=0,longest=0;const centered=[];for(let i=1;i<frames.length;i++){const f=frames[i],p=frames[i-1],delta=((f.x-p.x+f.period*1.5)%f.period)-f.period/2;if(f.nearest.label===p.nearest.label&&Math.abs(f.nearest.center)<.8&&Math.abs(delta)<.03)quiet+=(f.time-p.time)/1000;else{longest=Math.max(longest,quiet);quiet=0;}if(Math.abs(f.nearest.center)<.8&&centered.at(-1)!==f.nearest.label)centered.push(f.nearest.label)}longest=Math.max(longest,quiet);
   const sorted=frames.map(f=>f.minGap).sort((a,b)=>a-b);pair[name]={artifactIdentity:fixture.artifactIdentity,longestQuiet:longest,medianMinimumGap:sorted[Math.floor(sorted.length/2)],minimumGap:sorted[0],peakBlur:Math.max(...frames.map(f=>f.maxBlur)),centered,frames};
  }
  assert.ok(pair.current15.longestQuiet>=.10&&pair.current15.longestQuiet<=.23,'Observed quiet center rest is short');assert.ok(pair.baseline14.longestQuiet>.75&&pair.current15.longestQuiet<pair.baseline14.longestQuiet*.3,'Actual quiet rest is much shorter than14');assert.ok(pair.current15.medianMinimumGap<pair.baseline14.medianMinimumGap*.62,'Actual painted minimum gaps are substantially denser than14');assert.ok(pair.current15.minimumGap>=7,'Actual minimum configured gap remains separated');assert.ok(pair.current15.peakBlur<=1.01&&pair.current15.peakBlur<pair.baseline14.peakBlur*.4,'Actual outer blur is softer than14');assert.ok(pair.current15.centered.length>=6,'Default flows through all facts in sample');assert.ok(pair.current15.frames.every(f=>!f.clipped));results.push(pair);
 }
 assert.deepEqual(errors,[]);await writeFile(path.join(out,'report.json'),JSON.stringify({passed:true,results,errors},null,2));console.log('Actual default flow comparison passed: '+out);
}finally{await browser?.close();await Promise.all([baseline,current].map(f=>new Promise(resolve=>f.server.close(resolve))));}
