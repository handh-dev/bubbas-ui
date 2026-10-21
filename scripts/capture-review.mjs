import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";
const base = process.argv[2] || "http://127.0.0.1:4313/bubbas-ui/";
const directory = path.resolve(".impeccable/review");
await mkdir(directory, { recursive: true });
const browser = await chromium.launch();
const captures = [];
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
  });
  const go = async (slug = "") => {
    await page.goto(`${base}${slug ? `components/${slug}/` : ""}`, {
      waitUntil: "networkidle",
    });
    await page.evaluate(() => document.fonts.ready);
  };
  const capture = async (file, fullPage = true) => {
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: path.join(directory, file), fullPage });
    captures.push({ file, viewport: page.viewportSize(), fullPage });
  };
  await go();
  await capture("desktop.png");
  await page.setViewportSize({ width: 1280, height: 720 });
  await capture("user-1280.png");
  await page.setViewportSize({ width: 390, height: 844 });
  await capture("mobile.png");
  await page.setViewportSize({ width: 320, height: 844 });
  await capture("compact.png");
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page
    .getByRole("button", { name: "Appearance: dark", exact: true })
    .click();
  await capture("button-dark.png");
  await page
    .getByRole("button", { name: "Appearance: light", exact: true })
    .click();
  await go("form-field");
  await page.getByRole("button", { name: "State: error", exact: true }).click();
  await capture("form-error.png");
  await go("input");
  await page
    .getByRole("button", { name: "State: readonly", exact: true })
    .click();
  await capture("input-readonly.png");
  await go("select");
  await page.getByTestId("preview-stage").getByTestId("demo-select").click();
  await page.getByTestId("demo-select-dialog").waitFor();
  await capture("select-open.png", false);
  await page.keyboard.press("Escape");
  await go("dialog");
  await page.getByTestId("overlay-trigger").click();
  await page.getByTestId("demo-overlay").waitFor();
  await capture("dialog-open.png", false);
  await page.keyboard.press("Escape");
  await go("sheet");
  await page.getByTestId("overlay-trigger").click();
  await page.getByTestId("demo-overlay").waitFor();
  await capture("sheet-open.png", false);
  await page.keyboard.press("Escape");
  await go("tabs");
  await page.getByTestId("demo-tabs").getByRole("tab").nth(0).focus();
  await page.keyboard.press("ArrowRight");
  await capture("tabs-focus.png");
  await go("radio-group");
  await page.getByTestId("demo-radio").getByRole("radio").nth(0).focus();
  await page.keyboard.press("End");
  await capture("radio-focus.png");
  await go();
  await page.getByTestId("component-search").fill("checkbox");
  await page
    .getByRole("button", { name: "Review: change", exact: true })
    .click();
  await page
    .getByTestId("review-note")
    .fill("Example feedback: review the spacing around the action label.");
  await capture("review-notes-search.png");
  await page.goto(`${base}setup/`, { waitUntil: "networkidle" });
  await page
    .getByRole("button", { name: "Platform configuration", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Setup platform: Expo", exact: true })
    .click();
  await capture("setup-expo.png");
  await writeFile(
    path.join(directory, "capture-report.json"),
    JSON.stringify({ base, captures }, null, 2),
  );
  console.log(`Captured ${captures.length} review states in ${directory}`);
} finally {
  await browser.close();
}
