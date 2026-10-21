import assert from "node:assert/strict";
const names = [
  "Text",
  "Heading",
  "Stack",
  "Inline",
  "Container",
  "Card",
  "Divider",
  "Button",
  "IconButton",
  "Link",
  "Badge",
  "Avatar",
  "ListItem",
  "Input",
  "Textarea",
  "FormField",
  "Checkbox",
  "Switch",
  "RadioGroup",
  "Select",
  "Tabs",
  "Accordion",
  "Dialog",
  "Sheet",
  "Alert",
  "Toast",
  "Spinner",
  "Progress",
  "Skeleton",
  "EmptyState",
  "Breadcrumbs",
  "Pagination",
];
const slug = (name) => name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
async function readyOverlay(page, testID) {
  const content = page.getByTestId(testID);
  const dialog = page.getByRole("dialog").filter({ has: content });
  await dialog.waitFor();
  await page.waitForFunction(
    (panel) => panel.closest('[role="dialog"]') && panel.contains(document.activeElement),
    await content.elementHandle(),
  );
}
export async function verifyGallery(page) {
  const show = async (name) => {
    await page.getByTestId(`select-${slug(name)}`).click();
    await page.getByTestId(`gallery-${name}`).waitFor();
  };
  for (const name of names) await show(name);
  await show("Input");
  const input = page.getByTestId("demo-input");
  await input.fill("A real edit");
  assert.equal(await input.inputValue(), "A real edit");
  assert.equal(
    await page
      .getByRole("textbox", { name: "Read only example", exact: true })
      .getAttribute("readonly"),
    "",
  );
  assert.equal(
    await page
      .getByRole("textbox", { name: "Disabled example", exact: true })
      .isDisabled(),
    true,
  );
  await show("Textarea");
  await page
    .getByRole("textbox", { name: "Example notes", exact: true })
    .fill("Longer\nexample note");
  for (const [name, id] of [
    ["Checkbox", "demo-checkbox"],
    ["Switch", "demo-switch"],
  ]) {
    await show(name);
    const control = page.getByTestId(id);
    await control.focus();
    await page.keyboard.press("Space");
    assert.equal(await control.getAttribute("aria-checked"), "true");
    await page.keyboard.press("Space");
    assert.equal(await control.getAttribute("aria-checked"), "false");
  }
  await show("RadioGroup");
  const radio = page.getByTestId("demo-radio");
  const radios = radio.getByRole("radio");
  await radios.nth(0).focus();
  await page.keyboard.press("ArrowDown");
  assert.equal(await radios.nth(2).getAttribute("aria-checked"), "true");
  assert.equal(
    await radios.nth(2).evaluate((el) => el === document.activeElement),
    true,
  );
  await page.keyboard.press("Home");
  assert.equal(await radios.nth(0).getAttribute("aria-checked"), "true");
  await page.keyboard.press("End");
  assert.equal(await radios.nth(2).getAttribute("aria-checked"), "true");
  await show("Tabs");
  const tabs = page.getByTestId("demo-tabs").getByRole("tab");
  await tabs.nth(0).focus();
  await page.keyboard.press("ArrowRight");
  assert.equal(await tabs.nth(2).getAttribute("aria-selected"), "true");
  assert.equal(
    await tabs.nth(2).evaluate((el) => el === document.activeElement),
    true,
  );
  await page.getByText("Details panel content.", { exact: true }).waitFor();
  await page.keyboard.press("Home");
  assert.equal(await tabs.nth(0).getAttribute("aria-selected"), "true");
  await page.keyboard.press("End");
  assert.equal(await tabs.nth(2).getAttribute("aria-selected"), "true");
  await show("Select");
  await page.getByTestId("demo-select").click();
  await readyOverlay(page, "demo-select-dialog");
  await page.getByTestId("demo-select-option-large").click();
  assert.ok(
    (await page.getByTestId("demo-select").textContent()).includes("Large"),
  );
  assert.equal(await page.getByTestId("demo-select-dialog").count(), 0);
  await page.getByTestId("demo-select").click();
  await readyOverlay(page, "demo-select-dialog");
  await page.keyboard.press("Escape");
  await page.getByTestId("demo-select-dialog").waitFor({ state: "detached" });
  assert.equal(
    await page
      .getByTestId("demo-select")
      .evaluate((el) => el === document.activeElement),
    true,
  );
  await show("Accordion");
  const disclosure = page.getByRole("button", {
    name: "What is included?",
    exact: true,
  });
  await disclosure.click();
  assert.equal(await disclosure.getAttribute("aria-expanded"), "true");
  await disclosure.click();
  assert.equal(await disclosure.getAttribute("aria-expanded"), "false");
  for (const name of ["Dialog", "Sheet"]) {
    await show(name);
    for (const id of [
      "overlay-trigger",
      "overlay-trigger-two",
      "overlay-trigger",
      "overlay-trigger-two",
      "overlay-trigger",
      "overlay-trigger-two",
    ]) {
      const trigger = page.getByTestId(id);
      await trigger.click();
      await page.getByTestId("demo-overlay").waitFor();
      await readyOverlay(page, "demo-overlay");
      const close = page.getByRole("button", { name: "Close", exact: true });
      const done = page.getByRole("button", {
        name: "Done reviewing",
        exact: true,
      });
      await close.focus();
      await page.keyboard.press("Shift+Tab");
      assert.equal(
        await done.evaluate((el) => el === document.activeElement),
        true,
        `${name} backward focus wrap`,
      );
      await page.keyboard.press("Tab");
      assert.equal(
        await close.evaluate((el) => el === document.activeElement),
        true,
        `${name} forward focus wrap`,
      );
      await page.keyboard.press("Escape");
      await page.getByTestId("demo-overlay").waitFor({ state: "detached" });
      assert.equal(
        await trigger.evaluate((el) => el === document.activeElement),
        true,
        `${name} restores its actual trigger`,
      );
    }
    await page.getByTestId("overlay-trigger").click();
    await readyOverlay(page, "demo-overlay");
    await page
      .getByTestId("demo-overlay-backdrop")
      .click({ position: { x: 4, y: 4 } });
    await page.getByTestId("demo-overlay").waitFor({ state: "detached" });
    assert.notEqual(
      await page.evaluate(() => getComputedStyle(document.body).overflow),
      "hidden",
      `${name} restores scrolling`,
    );
  }
  await show("Toast");
  await page
    .getByRole("button", { name: "Show notification", exact: true })
    .click();
  await page.getByTestId("demo-toast").waitFor();
  await page
    .getByRole("button", { name: "Dismiss notification", exact: true })
    .click();
  await page.getByTestId("demo-toast").waitFor({ state: "detached" });
  await show("Progress");
  assert.equal(
    await page.getByTestId("demo-progress").getAttribute("aria-valuenow"),
    "20",
  );
  await page
    .getByRole("button", { name: "Advance progress", exact: true })
    .click();
  assert.equal(
    await page.getByTestId("demo-progress").getAttribute("aria-valuenow"),
    "40",
  );
  await show("Pagination");
  await page.getByRole("button", { name: "Next page", exact: true }).click();
  await page.getByText("Page 2 of 5", { exact: true }).waitFor();
  return {
    catalog: names,
    editing: true,
    keyboardChoices: true,
    rovingFocus: true,
    select: true,
    overlayFocusAndDismissal: true,
    disclosure: true,
    toast: true,
    progress: true,
    pagination: true,
  };
}

export async function verifyOverlayFixture(page, url) {
  await page.goto(new URL("/overlay-check", url).href, {
    waitUntil: "networkidle",
  });
  for (let cycle = 0; cycle < 3; cycle += 1) {
    if (cycle > 0) await page.getByTestId("default-reopen").click();
    await page.getByTestId("default-overlay").waitFor();
    await readyOverlay(page, "default-overlay");
    await page.getByTestId("nested-open").click();
    await page.getByTestId("nested-overlay").waitFor();
    await readyOverlay(page, "nested-overlay");
    await page.keyboard.press("Escape");
    await page.getByTestId("nested-overlay").waitFor({ state: "detached" });
    assert.equal(
      await page
        .getByTestId("nested-open")
        .evaluate((element) => element === document.activeElement),
      true,
      "Nested dismissal restores its actual trigger",
    );
    assert.equal(
      await page.evaluate(() => getComputedStyle(document.body).overflow),
      "hidden",
      "Parent overlay keeps the scroll lock after child dismissal",
    );
    await page
      .getByRole("button", { name: "Close initial", exact: true })
      .click();
    await page.getByTestId("default-overlay").waitFor({ state: "detached" });
    assert.notEqual(
      await page.evaluate(() => getComputedStyle(document.body).overflow),
      "hidden",
      "Final dismissal restores page scrolling",
    );
  }
  return {
    initialDefaultOpen: true,
    nestedFocusRestore: true,
    nestedScrollLock: true,
    reopenCycles: 3,
  };
}
