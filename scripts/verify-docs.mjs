import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";
import { serveDocs } from "./serve-docs.mjs";
import { verifyReviewStorage } from "./verify-review-storage.mjs";
import { verifyPatterns } from "./verify-patterns.mjs";
const evidence = path.resolve("artifacts/verification/docs");
await mkdir(evidence, { recursive: true });
const owned = process.argv[2] ? null : await serveDocs(0);
const base = process.argv[2] || owned.url;
const browser = await chromium.launch();
const errors = [];
try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(base, { waitUntil: "networkidle" });
  await page.getByTestId("preview-stage").waitFor();
  const links = page.getByTestId("component-filmstrip").getByRole("link");
  assert.equal(await links.count(), 32);
  const names = await links.evaluateAll((elements) =>
    elements.map((element) =>
      element.getAttribute("aria-label").replace("Review ", ""),
    ),
  );
  for (const name of names) {
    const slug = name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
    const response = await page.goto(`${base}components/${slug}/`, {
      waitUntil: "networkidle",
    });
    assert.equal(response.status(), 200);
    await page.getByRole("heading", { name, exact: true }).first().waitFor();
    await page.getByTestId("preview-stage").waitFor();
  }
  await page.goto(base, { waitUntil: "networkidle" });
  await page.getByTestId("component-search").fill("Dialog");
  assert.equal(await links.count(), 2);
  await page.getByTestId("component-search").fill("no-matching-component");
  await page
    .getByText("No components match “no-matching-component”.", { exact: true })
    .waitFor();
  await page
    .getByRole("button", { name: "Clear filters", exact: true })
    .click();
  assert.equal(await links.count(), 32);
  await page
    .getByRole("button", { name: "Variant: outline", exact: true })
    .click();
  assert.equal(
    await page
      .getByTestId("demo-button")
      .evaluate((element) => getComputedStyle(element).backgroundColor),
    "rgba(0, 0, 0, 0)",
  );
  await page.getByRole("button", { name: "Size: lg", exact: true }).click();
  assert.ok((await page.getByTestId("demo-button").boundingBox()).height >= 56);
  await page
    .getByRole("button", { name: "State: disabled", exact: true })
    .click();
  assert.equal(
    await page.getByTestId("demo-button").getAttribute("aria-disabled"),
    "true",
  );
  await page
    .getByRole("button", { name: "State: default", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Review: change", exact: true })
    .click();
  await page
    .getByTestId("review-note")
    .fill("Example feedback: check the button spacing.");
  await page
    .getByRole("button", { name: "Appearance: dark", exact: true })
    .click();
  await page.reload({ waitUntil: "networkidle" });
  assert.equal(
    await page.getByTestId("review-note").inputValue(),
    "Example feedback: check the button spacing.",
  );
  assert.equal(
    await page
      .getByRole("button", { name: "Appearance: dark", exact: true })
      .getAttribute("aria-pressed"),
    "true",
  );
  const second = await page.context().newPage();
  const setup = await page.context().newPage();
  await second.goto(`${base}components/input/`, { waitUntil: "networkidle" });
  await setup.goto(`${base}setup/`, { waitUntil: "networkidle" });
  await page
    .getByTestId("review-note")
    .fill("Button feedback from the first tab.");
  await second
    .getByTestId("review-note")
    .fill("Input feedback from the second tab.");
  await setup
    .getByRole("button", { name: "Appearance: light", exact: true })
    .click();
  await page.reload({ waitUntil: "networkidle" });
  await second.reload({ waitUntil: "networkidle" });
  assert.equal(
    await page.getByTestId("review-note").inputValue(),
    "Button feedback from the first tab.",
    "A stale setup tab must not overwrite Button feedback",
  );
  assert.equal(
    await second.getByTestId("review-note").inputValue(),
    "Input feedback from the second tab.",
    "Independent entries survive another tab’s appearance change",
  );
  await second
    .getByRole("button", { name: "State: readonly", exact: true })
    .click();
  await second
    .getByRole("link", { name: "Review Button", exact: true })
    .click();
  await second
    .getByRole("heading", { name: "Button", exact: true })
    .first()
    .waitFor();
  assert.equal(
    await second
      .getByRole("button", { name: "State: default", exact: true })
      .getAttribute("aria-pressed"),
    "true",
    "Component controls reset on client navigation",
  );
  assert.equal(
    await second.getByTestId("demo-button").getAttribute("aria-disabled"),
    null,
  );
  await second.close();
  await setup.close();
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export notes", exact: true }).click();
  const file = await download;
  await file.saveAs(path.join(evidence, "review-export.json"));
  assert.equal(file.suggestedFilename(), "bubbas-ui-review.json");
  await page
    .getByRole("button", { name: "Implementation · Web & Expo", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Example platform: Expo", exact: true })
    .click();
  await page
    .getByText("// Inside an Expo screen with NativeWind configured.", {
      exact: false,
    })
    .waitFor();
  await page
    .getByRole("button", { name: "Appearance: light", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Implementation · Web & Expo", exact: true })
    .click();
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({
    path: path.join(evidence, "desktop.png"),
    fullPage: true,
  });
  for (const width of [390, 320]) {
    await page.setViewportSize({ width, height: 844 });
    assert.ok(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      `No overflow at ${width}`,
    );
    await page.screenshot({
      path: path.join(evidence, width === 390 ? "mobile.png" : "compact.png"),
      fullPage: true,
    });
  }
  for (const route of ["foundations/", "setup/", "reference/", "patterns/", "compositions/"]) {
    const response = await page.goto(`${base}${route}`, {
      waitUntil: "networkidle",
    });
    assert.equal(response.status(), 200);
    assert.ok(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      `No overflow on ${route}`,
    );
  }
  await page.goto(`${base}patterns/`, { waitUntil: 'networkidle' });
  const patterns = await verifyPatterns(page);
  for (const width of [1440, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Patterns fit ${width}`);
    await page.screenshot({ path: path.join(evidence, `patterns-${width}.png`), fullPage: true });
  }
  const storageFailures = await verifyReviewStorage(browser, base);
  assert.deepEqual(errors, []);
  await writeFile(
    path.join(evidence, "report.json"),
    JSON.stringify(
      {
        status: "passed",
        names,
        routes: 38,
        patterns,
        search: true,
        controls: true,
        themePersistence: true,
        reviewPersistenceAndExport: true,
        storageFailures,
        multiTabReviewPersistence: true,
        clientNavigationReset: true,
        codePlatform: true,
        widths: [1440, 390, 320],
        errors,
      },
      null,
      2,
    ),
  );
  console.log(`Docs checks passed: ${evidence}`);
} finally {
  await browser.close();
  if (owned) await new Promise((resolve) => owned.server.close(resolve));
}
