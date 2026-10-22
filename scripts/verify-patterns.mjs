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
  const radioLayout = [];
  for (const width of [320, 390, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const scale of [1, 2]) {
      for (const name of ['Light', 'Dark', 'System']) {
        const label = appearance.getByRole('radio', { name, exact: true }).getByText(name, { exact: true });
        await label.evaluate((element, scale) => {
          // The consumer uses important:true; ordinary inline values lose to
          // NativeWind's stylesheet. Prove the effective scale before fit.
          element.style.setProperty('font-size', `${16 * scale}px`, 'important');
          element.style.setProperty('line-height', `${24 * scale}px`, 'important');
        }, scale);
        const computed = await label.evaluate(element => ({ fontSize: getComputedStyle(element).fontSize, lineHeight: getComputedStyle(element).lineHeight }));
        assert.equal(computed.fontSize, `${16 * scale}px`, 'Measure effective scaled text, not a defeated inline declaration');
        assert.equal(computed.lineHeight, `${24 * scale}px`);
      }
      await appearance.scrollIntoViewIfNeeded();
      const boxes = await Promise.all(['Light', 'Dark', 'System'].map(async name => {
        const radio = appearance.getByRole('radio', { name, exact: true });
        const label = radio.getByText(name, { exact: true });
        const bounds = await radio.boundingBox(), text = await label.boundingBox();
        assert.ok(bounds.width >= 144 && bounds.width <= (await appearance.boundingBox()).width + 1, 'Choice has readable basis and bounded width');
        assert.ok(text.width >= 75 && text.height <= 48 + 1, 'Scaled appearance label must not collapse into individual letters');
        const computed = await label.evaluate(element => ({ fontSize: getComputedStyle(element).fontSize, lineHeight: getComputedStyle(element).lineHeight }));
        return { name, ...computed, width: bounds.width, textWidth: text.width, textHeight: text.height };
      }));
      radioLayout.push({ viewport: width, textScale: scale, boxes });
    }
  }
  for (const name of ['Light', 'Dark', 'System']) await appearance.getByRole('radio', { name, exact: true }).getByText(name, { exact: true })
    .evaluate(element => { element.style.removeProperty('font-size'); element.style.removeProperty('line-height'); });
  if (viewport) await page.setViewportSize(viewport);
  await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'no-preference' });
  return { radioLayout, appearancePointerAndKeyboard: true, followsSystemChanges: true, explicitMissingZeroStaleSource: true, loadingEmptyErrorOfflineReady: true, retainedContent: true, retry: true };
}
