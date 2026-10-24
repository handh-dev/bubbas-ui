import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium } from 'playwright';
import { verifyGallery, verifyOverlayFixture } from './verify-gallery.mjs';
import { verifyPatterns } from './verify-patterns.mjs';


export async function verifyWeb(url, evidenceDirectory) {
  await mkdir(evidenceDirectory, { recursive: true });
  const browser = await chromium.launch();
  const errors = [];
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(url, { waitUntil: 'networkidle' });

    const button = page.getByTestId('count-button');
    const count = page.getByTestId('press-count');
    await button.waitFor();
    assert.equal(await count.textContent(), 'Button presses: 0');
    const paint = await button.evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        background: style.backgroundColor,
        minHeight: style.minHeight,
        paddingLeft: style.paddingLeft,
        height: element.getBoundingClientRect().height,
      };
    });
    assert.equal(paint.background, `rgb(${[1, 3, 5].map((start) => parseInt('D40000'.slice(start - 1, start + 1), 16)).join(', ')})`, 'NativeWind package styles must reach the browser');
    assert.ok(paint.height >= 44, 'The default touch target must be at least 44px tall');
    assert.ok(parseFloat(paint.paddingLeft) > 0, 'Package spacing utilities must be compiled');
    const compact = await page.getByTestId('compact-button').boundingBox();
    assert.ok(compact && compact.width >= 44 && compact.height >= 44, 'A short small Button must still provide a 44px target in both dimensions');
    assert.equal(await page.getByRole('button', { name: 'Help', exact: true }).count(), 1);

    await button.click();
    await page.waitForFunction(() => document.querySelector('[data-testid="press-count"]')?.textContent === 'Button presses: 1');
    await button.focus();
    await page.keyboard.press('Enter');
    await page.waitForFunction(() => document.querySelector('[data-testid="press-count"]')?.textContent === 'Button presses: 2');
    const focus = await button.evaluate((element) => ({
      style: getComputedStyle(element).outlineStyle,
      width: getComputedStyle(element).outlineWidth,
    }));
    assert.notEqual(focus.style, 'none', 'Keyboard users must get a visible focus outline');
    assert.ok(parseFloat(focus.width) >= 2, 'Keyboard focus outline must remain visible');

    const disabled = page.getByTestId('disabled-button');
    const loading = page.getByTestId('loading-button');
    assert.equal(await disabled.getAttribute('aria-disabled'), 'true');
    assert.equal(await loading.getAttribute('aria-disabled'), 'true');
    assert.equal(await loading.getAttribute('aria-busy'), 'true');
    await disabled.click({ force: true });
    await loading.click({ force: true });
    assert.equal(await count.textContent(), 'Button presses: 2', 'Inactive buttons must not invoke onPress');

    const gallery = await verifyGallery(page);
    const patterns = await verifyPatterns(page);
    const overlayFixture = await verifyOverlayFixture(page, url);
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.getByTestId('select-button').click();
    await page.screenshot({ path: path.join(evidenceDirectory, 'next-desktop.png'), fullPage: true });
    await page.setViewportSize({ width: 390, height: 844 });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Mobile layout must not overflow');
    // RNW ScrollView clips offscreen children. Paint the whole native scroll
    // surface after a viewport change before retaining a full-page specimen.
    await page.getByTestId('pattern-appearance').scrollIntoViewIfNeeded();
    await page.getByTestId('pattern-theme').getByRole('heading', { name: 'Campaign review', exact: true }).waitFor();
    await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    await page.getByTestId('patterns-demo').screenshot({ path: path.join(evidenceDirectory, 'next-mobile-patterns.png') });
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    await page.screenshot({ path: path.join(evidenceDirectory, 'next-mobile.png'), fullPage: true });
    assert.deepEqual(errors, [], 'No browser runtime errors');
    const result = { url, paint, compact, focus, pointerPress: true, keyboardPress: true, disabled: true, loading: true, mobileWidth: 390, gallery, patterns, overlayFixture, errors };
    await writeFile(path.join(evidenceDirectory, 'web.json'), `${JSON.stringify(result, null, 2)}\n`);
    return result;
  } finally {
    await browser.close();
  }
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const url = process.argv[2] ?? 'http://127.0.0.1:4310';
  const evidence = path.resolve(process.argv[3] ?? 'artifacts/verification/web');
  await verifyWeb(url, evidence);
  console.log(`Web interactions passed; evidence: ${evidence}`);
}
