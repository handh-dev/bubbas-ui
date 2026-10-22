import assert from 'node:assert/strict';

export async function verifyPatterns(page) {
  const demo = page.getByTestId('patterns-demo');
  const appearance = demo.getByRole('radiogroup', { name: 'Appearance', exact: true });
  const theme = demo.getByTestId('pattern-theme');
  const paint = () => theme.evaluate((element) => getComputedStyle(element).backgroundColor);
  await appearance.getByRole('radio', { name: 'Light', exact: true }).click();
  assert.equal(await paint(), 'rgb(247, 248, 250)');
  await page.keyboard.press('ArrowRight');
  assert.equal(await appearance.getByRole('radio', { name: 'Dark', exact: true }).getAttribute('aria-checked'), 'true');
  assert.equal(await paint(), 'rgb(23, 23, 23)');
  const focus = await appearance.getByRole('radio', { name: 'Dark', exact: true }).evaluate((element) => ({
    width: element.getBoundingClientRect().width, height: element.getBoundingClientRect().height,
    outline: getComputedStyle(element).outlineStyle, outlineWidth: parseFloat(getComputedStyle(element).outlineWidth),
  }));
  assert.ok(focus.width >= 44 && focus.height >= 44 && focus.outline !== 'none' && focus.outlineWidth >= 2);
  await page.keyboard.press('End');
  assert.equal(await appearance.getByRole('radio', { name: 'System', exact: true }).getAttribute('aria-checked'), 'true');
  await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'reduce' });
  await page.waitForFunction((element) => getComputedStyle(element).backgroundColor === 'rgb(247, 248, 250)', await theme.elementHandle());
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.waitForFunction((element) => getComputedStyle(element).backgroundColor === 'rgb(23, 23, 23)', await theme.elementHandle());
  const states = demo.getByRole('radiogroup', { name: 'Sample retrieval state', exact: true });
  const set = async (name) => states.getByRole('radio', { name, exact: true }).click();
  await set('empty');
  assert.equal(await demo.getByTestId('pattern-zero').count(), 0, 'Empty does not invent a zero');
  await demo.getByText('No sample campaigns', { exact: true }).waitFor();
  await set('offline');
  await demo.getByText('Saved sample · current campaign facts not verified', { exact: true }).waitFor();
  assert.equal(await demo.getByTestId('pattern-zero').textContent(), 'Verified sample orders: 0', 'Known zero survives cached state');
  await demo.getByText('Current retail price: unavailable', { exact: true }).waitFor();
  await demo.getByRole('button', { name: 'Try again', exact: true }).click();
  assert.equal(await demo.getByTestId('pattern-retries').textContent(), 'Sample retries: 1');
  assert.equal(await states.getByRole('radio', { name: 'ready', exact: true }).getAttribute('aria-checked'), 'true');
  await set('error');
  assert.equal(await demo.getByTestId('pattern-zero').count(), 1, 'Failure retains useful caller content');
  await demo.getByText('Sample source unavailable', { exact: true }).waitFor();
  await demo.getByRole('button', { name: 'Try again', exact: true }).click();
  await demo.getByRole('button', { name: 'Refresh sample', exact: true }).click();
  assert.equal(await states.getByRole('radio', { name: 'loading', exact: true }).getAttribute('aria-checked'), 'true');
  assert.equal(await demo.getByRole('progressbar', { name: 'Refreshing sample content…', exact: true }).count(), 1);
  assert.equal(await demo.getByRole('button', { name: 'Try again', exact: true }).count(), 0);
  await set('ready');
  await appearance.getByRole('radio', { name: 'Light', exact: true }).click();
  const viewport = page.viewportSize();
  for (const [width, size] of [[1440, '18px'], [390, '16px']]) {
    await page.setViewportSize({ width, height: 1000 });
    assert.equal(await demo.getByTestId('pattern-zero').evaluate((element) => getComputedStyle(element).fontSize), size, 'Canonical body type scale reaches consumer');
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  }
  if (viewport) await page.setViewportSize(viewport);
  await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'no-preference' });
  return { appearancePointerAndKeyboard: true, followsSystemChanges: true, explicitMissingZeroStaleSource: true, loadingEmptyErrorOfflineReady: true, retainedContent: true, retry: true };
}
