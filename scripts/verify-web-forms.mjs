import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { createServer } from 'node:http';
import { mkdir, readFile, realpath, symlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium } from 'playwright';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import * as RNW from 'react-native-web';
const require = createRequire(import.meta.url);
const { build } = createRequire(require.resolve('tsup'))('esbuild');
const root = path.resolve(process.argv[2] ?? 'packages/ui');
const evidence = path.resolve(process.argv[3] ?? 'artifacts/verification/web-forms');
await mkdir(evidence, { recursive: true });
const { Button, HeroSection } = await import(pathToFileURL(path.join(root, 'dist/web.js')));
for (const type of ['button', 'submit', 'reset']) assert.match(renderToStaticMarkup(React.createElement(Button, { type }, type)), new RegExp(`type="${type}"`));
const serverDirection = renderToStaticMarkup(React.createElement(RNW.View, { dir: 'rtl' }, React.createElement(Button, { style: { paddingStart: 37 } }, 'RTL')));
assert.ok(serverDirection.includes('padding-right:37px'), 'SSR shared Button must inherit the host RNW direction context');
assert.ok(!serverDirection.includes('padding-left:37px'), 'SSR logical start padding must not fall back to LTR');
const serverCallback = renderToStaticMarkup(React.createElement(RNW.View, { dir: 'rtl' }, React.createElement(Button, { style: ({pressed}) => ({marginStart: pressed ? 39 : 31}) }, 'Callback RTL')));
assert.ok(serverCallback.includes('margin-right:31px'), 'SSR callback style uses RNW state and inherited direction');
const uri = '/sample.svg';
const serverImage = renderToStaticMarkup(React.createElement(HeroSection, { title: 'Sample', image: { uri, alt: 'Sample art' } }));
assert.ok(serverImage.includes(uri), 'Server output must preserve the caller image URI before hydration');
const packageLink = path.join(evidence, 'node_modules/@bubbasfw/ui');
await mkdir(path.dirname(packageLink), { recursive: true });
await symlink(root, packageLink).catch((error) => { if (error.code !== 'EEXIST') throw error; });
assert.equal(await realpath(packageLink), await realpath(root), 'Fixture must resolve the exact requested artifact');
const script = `import React from 'react'; import {createRoot} from 'react-dom/client'; import {Button,ThemeProvider,HeroSection} from '@bubbasfw/ui/web'; import {View as HostView,Pressable as HostPressable} from 'react-native-web';
const e=React.createElement; let submits=0; let actions=0; let canceled=0;
createRoot(document.getElementById('root')).render(e(ThemeProvider,{},e('form',{id:'test-form',onSubmit(event){event.preventDefault();document.getElementById('submits').textContent=String(++submits);}},
e('label',{},'Required email',e('input',{id:'email',type:'email',required:true,defaultValue:''})),e('input',{id:'other',defaultValue:'original'}),
e(Button,{type:'submit',testID:'submit'},'Submit'),e(Button,{type:'reset',testID:'reset'},'Reset'),e(Button,{testID:'action',onPress(){document.getElementById('actions').textContent=String(++actions);}},'App action'),e(Button,{type:'submit',testID:'disabled',disabled:true},'Disabled submit'),e(Button,{type:'submit',testID:'loading',loading:true},'Busy submit'),e(Button,{type:'submit',testID:'canceled',onPress(event){event.preventDefault();document.getElementById('canceled-count').textContent=String(++canceled);}},'Canceled submit'),e('output',{id:'submits'},'0'),e('output',{id:'actions'},'0'),e('output',{id:'canceled-count'},'0')),e(HeroSection,{title:'Shared artwork',image:{uri:'/sample.svg',alt:'Sample art'}}),e(HostView,{dir:'rtl'},e(Button,{testID:'rtl-shared',style:{paddingStart:37}},'Shared RTL'),e(HostPressable,{testID:'rtl-host',style:{paddingStart:37}},e('span',{},'Host RTL')),e(Button,{testID:'rtl-object',style:{marginStart:23}},'Object style'),e(Button,{testID:'rtl-array',style:[{marginStart:17},null,{marginEnd:11}]},'Array style'),e(Button,{testID:'rtl-callback',ref:node=>{window.__callbackRef=node;},style:({pressed})=>({marginStart:pressed?39:31})},'Callback style'),e(Button,{testID:'rtl-marketing',appearance:'marketing',variant:'secondary',style:({pressed})=>({marginStart:pressed?39:31})},'Marketing callback'),e(Button,{testID:'rtl-disabled',disabled:true,style:({pressed})=>({marginStart:pressed?39:31})},'Disabled callback'),e(Button,{testID:'rtl-loading',loading:true,style:({pressed})=>({marginStart:pressed?39:31})},'Loading callback'))));`;
const browserBuild = await build({ metafile: true, stdin: { contents: script, resolveDir: evidence, loader: 'js' }, outfile: path.join(evidence, 'fixture.js'), bundle: true, platform: 'browser', format: 'esm', define: { 'process.env.NODE_ENV': '"production"' } });
assert.ok(Object.keys(browserBuild.metafile.inputs).some((file) => file.endsWith('/dist/web.browser.js')), 'Browser package resolution must select the browser condition');
const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="120" height="80"><rect width="120" height="80" fill="blue"/></svg>';
const server = createServer(async (request, response) => {
  if (request.url === '/fixture.js') { response.setHeader('Content-Type', 'text/javascript'); response.end(await readFile(path.join(evidence, 'fixture.js'))); }
  else if (request.url === '/web.css') { response.setHeader('Content-Type', 'text/css'); response.end(await readFile(path.join(root, 'dist/web.css'))); }
  else if (request.url === '/sample.svg') { response.setHeader('Content-Type', 'image/svg+xml'); response.end(svg); }
  else { response.setHeader('Content-Type', 'text/html'); response.end('<!doctype html><html><head><link rel="stylesheet" href="/web.css"></head><body><div id="root"></div><script type="module" src="/fixture.js"></script></body></html>'); }
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
let browser;
try {
  browser = await chromium.launch({executablePath:chromium.executablePath()});
  const page = await browser.newPage(); const errors=[];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(`http://127.0.0.1:${server.address().port}`, { waitUntil:'networkidle' });
  const direction = await page.getByTestId('rtl-shared').evaluate((node) => ({left:node.style.paddingLeft,right:node.style.paddingRight}));
  const hostDirection = await page.getByTestId('rtl-host').evaluate((node) => ({left:node.style.paddingLeft,right:node.style.paddingRight}));
  assert.equal(direction.right, '37px', 'Shared primitive inherits the browser host RNW direction context');
  assert.equal(hostDirection.right, '37px', 'Host comparator verifies RTL context is active');
  assert.notEqual(direction.left, '37px', 'Shared logical padding must not silently use LTR');
  assert.equal(await page.getByTestId('rtl-object').evaluate(node=>getComputedStyle(node).marginRight),'23px','Caller object styles affect actual RTL layout');
  assert.deepEqual(await page.getByTestId('rtl-array').evaluate(node=>({left:getComputedStyle(node).marginLeft,right:getComputedStyle(node).marginRight})),{left:'11px',right:'17px'},'Caller style arrays preserve order and direction');
  assert.equal(await page.getByTestId('rtl-callback').evaluate(node=>node===window.__callbackRef),true,'Shared ref reaches the actual focusable button');
  assert.ok(await page.getByTestId('rtl-callback').evaluate(node=>parseFloat(getComputedStyle(node).minHeight)>=44),'NativeWind class styles survive callback composition');
  for (const id of ['rtl-callback','rtl-marketing']) {
    const button=page.getByTestId(id);
    assert.equal(await button.evaluate(node=>getComputedStyle(node).marginRight),'31px');
    await button.focus();
    assert.equal(await button.evaluate(node=>node===document.activeElement),true,'Callback wrapper preserves focus');
    await page.keyboard.down('Space');
    await page.waitForFunction(id=>getComputedStyle(document.querySelector('[data-testid="'+id+'"]')).marginRight==='39px',id);
    await page.keyboard.up('Space');
    await page.waitForFunction(id=>getComputedStyle(document.querySelector('[data-testid="'+id+'"]')).marginRight==='31px',id);
    const box=await button.boundingBox();
    await page.mouse.move(box.x+box.width/2,box.y+box.height/2); await page.mouse.down();
    await page.waitForFunction(id=>getComputedStyle(document.querySelector('[data-testid="'+id+'"]')).marginRight==='39px',id);
    await page.mouse.up();
    await page.waitForFunction(id=>getComputedStyle(document.querySelector('[data-testid="'+id+'"]')).marginRight==='31px',id);
  }
  for(const id of ['rtl-disabled','rtl-loading']) {
    const button=page.getByTestId(id); assert.equal(await button.isDisabled(),true);
    await button.click({force:true});
    assert.equal(await button.evaluate(node=>getComputedStyle(node).marginRight),'31px','Inactive callback receives unpressed state');
  }
  await page.emulateMedia({reducedMotion:'reduce'});
  assert.equal(await page.getByTestId('rtl-marketing').evaluate(node=>getComputedStyle(node).transitionDuration),'0s');
  await page.getByTestId('submit').click();
  assert.equal(await page.locator('#submits').textContent(), '0', 'Native required validation must block submission');
  assert.equal(await page.locator('#email').evaluate((input) => input.validity.valueMissing), true);
  await page.locator('#email').fill('review@example.test');
  await page.getByTestId('submit').click();
  assert.equal(await page.locator('#submits').textContent(), '1', 'Click invokes form submission');
  await page.locator('#other').focus(); await page.keyboard.press('Enter');
  assert.equal(await page.locator('#submits').textContent(), '2', 'Enter invokes implicit form submission');
  await page.getByTestId('action').click();
  assert.equal(await page.locator('#actions').textContent(), '1');
  assert.equal(await page.locator('#submits').textContent(), '2', 'Default button stays an app action');
  await page.getByTestId('canceled').click();
  assert.equal(await page.locator('#canceled-count').textContent(), '1');
  assert.equal(await page.locator('#submits').textContent(), '2', 'Caller preventDefault preserves form cancellation');
  await page.getByTestId('disabled').click({force:true}); await page.getByTestId('loading').click({force:true});
  assert.equal(await page.locator('#submits').textContent(), '2', 'Inactive submit buttons cannot submit');
  await page.locator('#other').fill('edited'); await page.getByTestId('reset').click();
  assert.equal(await page.locator('#other').inputValue(), 'original', 'Native reset restores default values');
  assert.equal(await page.locator('#email').inputValue(), '');
  const image = page.locator('img[src="/sample.svg"]');
  assert.equal(await image.count(), 1);
  assert.equal(await image.evaluate((element) => element.complete && element.naturalWidth > 0), true, 'Caller image actually loads');
  const imageBox = await image.boundingBox(); assert.ok(imageBox && imageBox.width > 0 && imageBox.height > 0, 'Image owns visible layout');
  assert.deepEqual(errors, []);
  await page.screenshot({path:path.join(evidence,'form-and-image.png'),fullPage:true});
  await writeFile(path.join(evidence,'report.json'),JSON.stringify({browserVersion:browser.version(),packageRoot:root,ssrTypes:true,ssrImage:true,ssrInheritedDirection:true,ssrCallbackDirection:true,objectStyles:true,arrayStyles:true,forwardedRef:true,callbackClassStyles:true,callbackPointerAndKeyboard:true,callbackFocus:true,inactiveCallback:true,reducedMotion:true,browserInheritedDirection:direction,hostDirection,clickSubmit:true,enterSubmit:true,requiredValidation:true,reset:true,defaultAction:true,preventDefault:true,disabled:true,loading:true,imageLoaded:true,errors},null,2)+'\n');
  console.log(`Form and SSR image checks passed: ${evidence}`);
} finally { if(browser) await browser.close(); await new Promise((resolve) => server.close(resolve)); }
