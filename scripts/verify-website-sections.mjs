// Actual built shared UI. Provider imagery is stubbed; no automated OSM requests.
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { createServer } from 'node:http';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { StyleSheet } from 'react-native-web';
import { chromium } from 'playwright';
import * as api from '../packages/ui/dist/web.js';

const out=path.resolve('artifacts/verification/website-sections');
await mkdir(out,{recursive:true});
const require=createRequire(import.meta.url),{build}=createRequire(require.resolve('tsup'))('esbuild');
function tree(api,React) {
  const h=React.createElement;
  const links=['Home','Shop','Deals','Locations','Buy here light here','Safety & FAQ'].map((label,index)=>({label,href:`#example-${index}`}));
  return h(api.ThemeProvider,{fontFamily:'Montserrat'},
    h(api.SiteHeader,{variant:'marketing',brand:{label:'Sample brand',href:'#sample'},links,action:{label:'Shop now',href:'#shop'},announcement:'Synthetic announcement for scroll verification',showSocialLinks:false,showMotionControl:false,announcementScrollBehavior:'hide',className:'fixture-header'}),
    h(api.Stack,{className:'fixture-main',gap:8},
      h(api.SectionDemo,{name:'LocationSearch',variant:'marketing'}),
      h(api.LocationMap,{title:'Synthetic map',pins:[{id:'alpha',title:'Example Alpha',latitude:33.2,longitude:-96.7,href:'#alpha'},{id:'beta',title:'Example Beta',latitude:33.4,longitude:-96.9,href:'#beta'}],tileUrlTemplate:'https://tile.openstreetmap.org/{z}/{x}/{y}.png',attribution:{label:'© OpenStreetMap contributors',href:'https://www.openstreetmap.org/copyright'}}),
      ...['LocationGrid','LocationHours','FAQSection','SafetySection','FeaturedProductRow','OfferGrid'].map(name=>h(api.Stack,{key:name,className:`fixture-${name}`},h(api.SectionDemo,{name,variant:'marketing'})))
    )
  );
}
const markup=renderToString(tree(api,React)),sheet=StyleSheet.getSheet();
const bundle=await build({stdin:{contents:`import React from'react';import{hydrateRoot}from'react-dom/client';import * as api from'@bubbasfw/ui/web';const tree=${tree.toString()};hydrateRoot(document.getElementById('root'),tree(api,React));`,resolveDir:process.cwd(),loader:'js'},write:false,bundle:true,platform:'browser',format:'esm',alias:{'@bubbasfw/ui/web':path.resolve('packages/ui/dist/web.browser.js')},define:{'process.env.NODE_ENV':'"production"'}});
const html=`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/web.css"><style id="${sheet.id}">${sheet.textContent}</style><style>@font-face{font-family:Montserrat;src:url(/font.ttf);font-weight:100 900}body{margin:0;background:#F4F8FF}.fixture-header{position:fixed!important;top:0;left:0;width:100%;z-index:10}.fixture-main{padding:160px 16px 100px;min-height:3000px}</style></head><body><div id="root">${markup}</div><script type="module" src="/fixture.js"></script></body></html>`;
const server=createServer(async(req,res)=>{const pathname=new URL(req.url,'http://local').pathname;let body=html,type='text/html';if(pathname==='/web.css'){body=await readFile('packages/ui/dist/web.css');type='text/css';}else if(pathname==='/fixture.js'){body=bundle.outputFiles[0].contents;type='text/javascript';}else if(pathname==='/font.ttf'){body=await readFile('apps/docs/public/fonts/montserrat.ttf');type='font/ttf';}res.setHeader('Content-Type',type);res.end(body);});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const url=`http://127.0.0.1:${server.address().port}`;
const tile='<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256"><rect width="256" height="256" fill="#E8F1E1"/><path d="M0 128H256M128 0V256" stroke="#FFFFFF" stroke-width="8"/></svg>';
let browser;const errors=[],layouts=[],scroll=[];let interceptedTiles=0;
try {
  browser=await chromium.launch({headless:true});const context=await browser.newContext();let failTiles=false;
  await context.route('https://tile.openstreetmap.org/**',route=>{interceptedTiles++;return failTiles?route.abort('failed'):route.fulfill({status:200,contentType:'image/svg+xml',body:tile});});
  const page=await context.newPage();page.on('pageerror',error=>errors.push(error.message));
  for(const width of[320,390,768,1440]) {
    await page.setViewportSize({width,height:972});await page.goto(url,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);
    assert.equal(await page.locator('.bubba-social-links').count(),0);
    assert.equal(await page.getByRole('switch',{name:/Decorative motion/}).count(),0);
    assert.equal(await page.locator('.bubba-hours-day').count(),10);
    assert.equal(await page.getByText('Today',{exact:true}).count(),1);
    assert.equal(await page.locator('.bubba-map-pin').count(),2,'All supplied pins fit the measured initial viewport');
    assert.equal(await page.getByRole('button',{name:'Zoom map in',exact:true}).evaluate(node=>getComputedStyle(node.parentElement).zIndex),'4','Map controls stay above every geographic marker');
    const layout=await page.evaluate(()=>({width:innerWidth,overflow:document.documentElement.scrollWidth>innerWidth,offenders:[...document.querySelectorAll('*')].filter(e=>{const r=e.getBoundingClientRect();return r.width&&r.right>innerWidth+.5&&getComputedStyle(e).position!=='absolute';}).slice(0,15).map(e=>({class:e.className,text:e.textContent.slice(0,70),width:e.getBoundingClientRect().width,right:e.getBoundingClientRect().right})),locations:[...document.querySelectorAll('.bubba-location-grid-item')].map(e=>({x:e.getBoundingClientRect().x,y:e.getBoundingClientRect().y,width:e.getBoundingClientRect().width})),offers:[...document.querySelectorAll('.bubba-offer-card')].map(e=>({y:e.getBoundingClientRect().y,height:e.getBoundingClientRect().height}))}));
    if(layout.overflow){await page.screenshot({path:path.join(out,`overflow-${width}.png`),fullPage:true});await writeFile(path.join(out,'overflow.json'),JSON.stringify(layout,null,2));}
    assert.equal(layout.overflow,false,`No horizontal overflow at ${width}`);
    const actionBounds=await page.locator('.bubba-location-action').evaluateAll(nodes=>nodes.map(node=>{const box=node.getBoundingClientRect(),label=node.querySelector('.bubba-action-label').getBoundingClientRect();return {width:box.width,height:box.height,labelContained:label.left>=box.left-.5&&label.right<=box.right+.5};}));
    assert.ok(actionBounds.every(box=>box.width>=44&&box.height>=44&&box.labelContained),`Contained compact action labels and targets at ${width}`);
    if(width===1440){assert.ok(layout.locations.every(item=>Math.abs(item.y-layout.locations[0].y)<1),'Four directory columns');assert.ok(layout.offers.every(item=>Math.abs(item.height-layout.offers[0].height)<1),'Offer cards share row height');}
    layouts.push(layout);await page.screenshot({path:path.join(out,`sections-${width}.png`)});
  }
  const query=page.getByRole('textbox',{name:'Find a Bubba’s near you'});await query.fill('Example city');await query.press('Enter');await page.getByRole('status').filter({hasText:'Example search submitted: Example city'}).waitFor();
  const mapPin=page.getByRole('link',{name:'Directions to Example Alpha',exact:true});assert.equal(await mapPin.locator('.bubba-map-pin-label').isVisible(),false);await mapPin.focus();assert.equal(await mapPin.locator('.bubba-map-pin-label').isVisible(),true);await page.getByRole('button',{name:'Zoom map in',exact:true}).focus();
  const question=page.getByRole('button',{name:'How does this example disclosure work?'});await question.focus();await page.keyboard.press('Enter');assert.equal(await question.getAttribute('aria-expanded'),'true');assert.equal(await page.getByText(/Choose a question to reveal its answer/).isVisible(),true);await page.keyboard.press('Space');assert.equal(await question.getAttribute('aria-expanded'),'false');
  await page.evaluate(()=>scrollTo(0,0));await page.waitForTimeout(50);const height=await page.locator('.fixture-header').evaluate(e=>e.getBoundingClientRect().height);
  for(const y of[0,8,20,35,44,90,25,0]){await page.evaluate(y=>scrollTo(0,y),y);await page.waitForTimeout(40);const geometry=await page.locator('.fixture-header').evaluate(e=>({height:e.getBoundingClientRect().height,top:e.getBoundingClientRect().top,rowTop:e.querySelector('.bubba-header-row').getBoundingClientRect().top}));assert.equal(geometry.height,height,'Header never changes measured layout height');assert.ok(Math.abs(geometry.top+Math.min(y,44))<.1,'Header offset follows scroll continuously');scroll.push({y,...geometry});}
  await page.emulateMedia({reducedMotion:'reduce'});await page.evaluate(()=>scrollTo(0,100));await page.waitForTimeout(60);assert.equal(await page.locator('.fixture-header').evaluate(e=>e.getBoundingClientRect().top),0);await page.emulateMedia({reducedMotion:'no-preference'});
  await page.evaluate(()=>scrollTo(0,0));await page.getByRole('button',{name:'Zoom map in',exact:true}).click();await page.getByRole('button',{name:'Show all locations on map'}).click();assert.equal(await page.locator('.bubba-map-pin').count(),2);
  failTiles=true;await page.reload({waitUntil:'networkidle'});await page.getByText('Map tiles could not load.',{exact:false}).waitFor();failTiles=false;await page.getByRole('button',{name:'Retry map'}).click();await page.getByText('Map tiles could not load.',{exact:false}).waitFor({state:'hidden'});
  const nojs=await browser.newContext({javaScriptEnabled:false});let nojsTiles=0;await nojs.route('https://tile.openstreetmap.org/**',route=>{nojsTiles++;return route.fulfill({status:200,contentType:'image/svg+xml',body:tile});});const staticPage=await nojs.newPage();await staticPage.goto(url);assert.equal(nojsTiles,0,'SSR/no-script never guesses viewport or requests tiles');assert.equal(await staticPage.getByText(/interactive map requires JavaScript/).isVisible(),true);assert.equal(await staticPage.getByText(/Choose a question to reveal its answer/).isVisible(),true);assert.equal(await staticPage.getByText(/The complete question stays readable/).isVisible(),true);await nojs.close();
  assert.deepEqual(errors,[]);assert.ok(interceptedTiles>0);await writeFile(path.join(out,'report.json'),JSON.stringify({layouts,scroll,interceptedTiles,actualProviderRequests:0,searchEnter:true,faqKeyboard:true,reducedMotion:true,tileFailureRetry:true,noScriptDirectoryFallback:true,errors},null,2));console.log(`Shared website section checks passed: ${out}`);
} finally {await browser?.close();await new Promise(resolve=>server.close(resolve));}
