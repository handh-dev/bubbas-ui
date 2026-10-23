// Focused owner-selected presentation proof, not full release qualification.
import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import path from 'node:path';
import {chromium} from 'playwright';
import {createFocusMarqueeFixture} from './focus-marquee-fixture.mjs';
const f=await createFocusMarqueeFixture({preset:'spring',evidence:process.env.SELECTION_EVIDENCE??'artifacts/verification/focus-marquee-selection'});
let browser;const errors=[],checks=[];
try{
 const api=await import(pathToFileURL(path.join(f.pkg,'dist/web.js'))),preset=api.FOCUS_MARQUEE_CAMPAIGN_PRESET;
 assert.equal(api.FOCUS_MARQUEE_DEFAULT_CADENCE,2.3);
 if(process.env.SELECTION_SETTINGS){const {version,previewWidth,items,...presentation}=JSON.parse(await readFile(process.env.SELECTION_SETTINGS,'utf8'));assert.deepEqual(preset,presentation);}
 browser=await chromium.launch({headless:true});const page=await browser.newPage();page.on('pageerror',error=>errors.push(error.message));
 for(const width of[557,950]){
  await page.setViewportSize({width,height:972});await page.goto(f.origin+'/?mode=selected',{waitUntil:'networkidle'});const root=page.locator('.bubba-focus-marquee');await root.locator(':scope[data-bubba-focus-active=true]').waitFor();
  const samples=await root.evaluate(node=>new Promise(resolve=>{const frames=[];function frame(time){const track=node.querySelector('.bubba-focus-track');frames.push({time,x:new DOMMatrixReadOnly(getComputedStyle(track).transform).m41});if(frames.length<420)requestAnimationFrame(frame);else resolve(frames);}requestAnimationFrame(frame);}));
  const holds=[];let start;for(let i=1;i<samples.length;i++){const still=Math.abs(samples[i].x-samples[i-1].x)<.015;if(still&&start===undefined)start=samples[i-1].time;if(!still&&start!==undefined){holds.push({start,seconds:(samples[i-1].time-start)/1000});start=undefined;}}
  const full=holds.slice(1),periods=full.slice(1).map((event,index)=>(event.start-full[index].start)/1000);assert.ok(full.length>=2&&full.every(h=>h.seconds>1.02&&h.seconds<1.18),'Actual hold is1.1 seconds');assert.ok(periods.length&&periods.every(p=>p>1.56&&p<1.72),'Actual selected cycle is1.64seconds');
  const paint=await root.evaluate(node=>{const pill=node.querySelector('.bubba-focus-item>.bubba-focus-pill'),label=pill.firstElementChild;return{gap:node.style.getPropertyValue('--bubba-focus-gap'),rounded:getComputedStyle(pill).borderRadius,fontSize:getComputedStyle(label).fontSize,color:getComputedStyle(label).color,blur:[...node.querySelectorAll('.bubba-focus-item>.bubba-focus-pill')].map(p=>parseFloat(getComputedStyle(p).filter.match(/blur\(([^p]+)/)?.[1]??0))};});assert.equal(paint.gap,'1px');assert.equal(paint.rounded,'4px');assert.equal(paint.fontSize,'14px');assert.equal(paint.color,'rgb(3, 37, 108)');assert.ok(Math.max(...paint.blur)>1.4&&Math.max(...paint.blur)<=1.5);
  await root.evaluate(node=>node.dataset.proof='same-selected-root');await page.evaluate(preset=>globalThis.changeMarquee({...preset,items:['16 DFW LOCATIONS','PRICE BEAT GUARANTEE','FREE POP-ITS W/ FOLLOW','OPEN DAILY THROUGH JULY 5TH','AMERICA’S 250TH ANNIVERSARY','BUY HERE LIGHT HERE — $30/CAR']}),preset);assert.equal(await root.getAttribute('data-proof'),'same-selected-root');
  await page.screenshot({path:path.join(f.out,`selected-${width}.png`)});checks.push({width,fullHolds:full,periods,paint,rootRetention:true});
 }
 await page.goto(f.origin+'/?mode=catalog',{waitUntil:'networkidle'});await page.getByTestId('focus-marquee-campaign-preview').locator(':scope[data-bubba-focus-active=true]').waitFor();assert.equal(await page.getByRole('textbox',{name:'Seconds per pill',exact:true}).inputValue(),'2.3');assert.ok(await page.getByText('Selected campaign preset · 1.64 seconds per pill',{exact:true}).count());
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto(f.origin+'/?mode=selected',{waitUntil:'networkidle'});assert.notEqual(await page.locator('.bubba-focus-marquee').getAttribute('data-bubba-focus-active'),'true');assert.equal(await page.locator('.bubba-focus-static .bubba-focus-label').count(),6);assert.ok(await page.locator('.bubba-focus-pill').evaluateAll(nodes=>nodes.every(n=>getComputedStyle(n).filter==='none')));
 const nojs=await browser.newContext({javaScriptEnabled:false,viewport:{width:320,height:972}}),staticPage=await nojs.newPage();await staticPage.goto(f.origin+'/?mode=selected',{waitUntil:'networkidle'});assert.equal(await staticPage.locator('.bubba-focus-static .bubba-focus-label').count(),6);assert.equal(await staticPage.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await nojs.close();assert.deepEqual(errors,[]);
 await writeFile(path.join(f.out,'report.json'),JSON.stringify({passed:true,scope:'Selected presentation only; full release/native/Core/HQ/recovery gates deferred',artifactIdentity:f.artifactIdentity,preset,genericCadence:api.FOCUS_MARQUEE_DEFAULT_CADENCE,checks,selectedCatalog:true,reducedAndNoJavaScriptComplete:true,errors},null,2));console.log('Selected actual shared presentation passed: '+f.out);
}finally{await browser?.close();await new Promise(resolve=>f.server.close(resolve));}
