import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
async function exported(page) {
  const pending = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export notes", exact: true }).click();
  return JSON.parse(await readFile(await (await pending).path(), "utf8"));
}
export async function verifyReviewStorage(browser, base) {
  const context = await browser.newContext();
  try {
    const page = await context.newPage();
    await page.goto(base, { waitUntil: "networkidle" });
    await page.getByTestId("review-note").fill("Previously saved feedback.");
    await page.evaluate(() => {
      Storage.prototype.setItem = () => {
        throw new DOMException("Simulated full storage", "QuotaExceededError");
      };
    });
    await page.getByTestId("review-note").fill("New feedback kept in memory.");
    await page
      .getByRole("button", { name: "Review: change", exact: true })
      .click();
    await page
      .getByRole("button", { name: "Appearance: dark", exact: true })
      .click();
    assert.equal(
      await page.getByTestId("review-note").inputValue(),
      "New feedback kept in memory.",
    );
    const result = await exported(page);
    assert.equal(result.reviews.Button.note, "New feedback kept in memory.");
    assert.equal(result.reviews.Button.status, "change");
    assert.equal(result.appearance, "dark");
  } finally {
    await context.close();
  }
  const legacy = await browser.newContext();
  try {
    await legacy.addInitScript(() => {
      localStorage.setItem(
        "bubbas-ui-review-v1",
        JSON.stringify({
          reviews: {
            Button: {
              status: "change",
              note: "Retained legacy feedback.",
              updatedAt: "2026-10-21T12:00:00.000Z",
            },
          },
        }),
      );
      Storage.prototype.setItem = () => {
        throw new DOMException("Simulated full storage", "QuotaExceededError");
      };
    });
    const page = await legacy.newPage();
    await page.goto(base, { waitUntil: "networkidle" });
    assert.equal(
      await page.getByTestId("review-note").inputValue(),
      "Retained legacy feedback.",
    );
    assert.equal(
      (await exported(page)).reviews.Button.note,
      "Retained legacy feedback.",
    );
  } finally {
    await legacy.close();
  }
  return {
    quotaFailurePreservesNoteAndStatus: true,
    quotaFailurePreservesAppearance: true,
    legacyMigrationFailurePreservesExport: true,
  };
}
