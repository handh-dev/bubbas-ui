import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { createServer } from 'node:http';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium } from 'playwright';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
const require = createRequire(import.meta.url);
const { build } = createRequire(require.resolve('tsup'))('esbuild');
const root = path.resolve(process.argv[2] ?? 'packages/ui');
const evidence = path.resolve(process.argv[3] ?? 'artifacts/verification/web-forms');
await mkdir(evidence, { recursive: true });
const { Button, HeroSection } = await import(pathToFileURL(path.join(root, 'dist/web.js')));
for (const type of ['button', 'submit', 'reset']) assert.match(renderToStaticMarkup(React.createElement(Button, { type }, type)), new RegExp(`type="${type}"`));
const uri = '/sample.svg';
const serverImage = renderToStaticMarkup(React.createElement(HeroSection, { title: 'Sample', image: { uri, alt: 'Sample art' } }));
assert.ok(serverImage.includes(uri), 'Server output must preserve the caller image URI before hydration');
const script = `import React from 'react'; import {createRoot} from 'react-dom/client'; import {Button,ThemeProvider,HeroSection} from ${JSON.stringify(path.join(root, 'dist/web.js'))};
const e=React.createElement; let submits=0; let actions=0; let canceled=0;
createRoot(document.getElementById('root')).render(e(ThemeProvider,{},e('form',{id:'test-form',onSubmit(event){event.preventDefault();document.getElementById('submits').textContent=String(++submits);}},
e('label',{},'Required email',e('input',{id:'email',type:'email',required:true,defaultValue:''})),e('input',{id:'other',defaultValue:'original'}),
e(Button,{type:'submit',testID:'submit'},'Submit'),e(Button,{type:'reset',testID:'reset'},'Reset'),e(Button,{testID:'action',onPress(){document.getElementById('actions').textContent=String(++actions);}},'App action'),e(Button,{type:'submit',testID:'disabled',disabled:true},'Disabled submit'),e(Button,{type:'submit',testID:'loading',loading:true},'Busy submit'),e(Button,{type:'submit',testID:'canceled',onPress(event){event.preventDefault();document.getElementById('canceled-count').textContent=String(++canceled);}},'Canceled submit'),e('output',{id:'submits'},'0'),e('output',{id:'actions'},'0'),e('output',{id:'canceled-count'},'0')),e(HeroSection,{title:'Shared artwork',image:{uri:'/sample.svg',alt:'Sample art'}})));`;
await build({ stdin: { contents: script, resolveDir: process.cwd(), loader: 'js' }, outfile: path.join(evidence, 'fixture.js'), bundle: true, platform: 'browser', format: 'esm', define: { 'process.env.NODE_ENV': '"production"' } });
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
  browser = await chromium.launch();
  const page = await browser.newPage(); const errors=[];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(`http://127.0.0.1:${server.address().port}`, { waitUntil:'networkidle' });
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
  await writeFile(path.join(evidence,'report.json'),JSON.stringify({packageRoot:root,ssrTypes:true,ssrImage:true,clickSubmit:true,enterSubmit:true,requiredValidation:true,reset:true,defaultAction:true,preventDefault:true,disabled:true,loading:true,imageLoaded:true,errors},null,2)+'\n');
  console.log(`Form and SSR image checks passed: ${evidence}`);
} finally { if(browser) await browser.close(); await new Promise((resolve) => server.close(resolve)); }
