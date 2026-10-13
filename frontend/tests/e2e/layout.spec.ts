import type { Page } from "@playwright/test";

import { expect, test } from "./fixtures";

/**
 * Every page renders its layout with the base styles on the reference phone.
 * Not a visual review: it catches a page that breaks, loses its styles or
 * overflows a 360px screen.
 */
const PAGES = [
  { name: "the join page", path: "/", heading: "Únete a un taller" },
  { name: "the facilitator's dashboard", path: "/panel", heading: "Hola, Ana" },
  { name: "the room, as a participant", path: "/session/demo", heading: "Manejo de la ansiedad" },
  { name: "the room, as the facilitator", path: "/session/demo?role=host", heading: "Manejo de la ansiedad" },
];

/** Console errors and failed requests, recorded from before navigation. */
function collectProblems(page: Page): string[] {
  const problems: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") problems.push(`console: ${message.text()}`);
  });
  page.on("pageerror", (error) => problems.push(`uncaught: ${error.message}`));
  page.on("requestfailed", (request) => problems.push(`request failed: ${request.url()}`));
  page.on("response", (response) => {
    if (response.status() >= 400) problems.push(`HTTP ${response.status()}: ${response.url()}`);
  });
  return problems;
}

async function expectRendersProperly(page: Page, heading: string, problems: string[]) {
  await expect(page.getByRole("main")).toBeVisible();
  await expect(page.getByRole("heading", { level: 1, name: heading })).toBeVisible();

  // The base styles loaded and their tokens resolve: the page's background
  // and the minimum size of its main touch target (a primary button, or a
  // call control in the live session) come from tokens.css.
  const styles = await page.evaluate(() => {
    const root = getComputedStyle(document.documentElement);
    const button = document.querySelector<HTMLElement>(".btn-primary, .control-btn");
    return {
      background: getComputedStyle(document.body).backgroundColor,
      expectedBackground: root.getPropertyValue("--bg").trim(),
      buttonHeight: button?.getBoundingClientRect().height ?? 0,
      tapMin: Number.parseFloat(root.getPropertyValue("--tap-min")),
    };
  });
  expect(styles.expectedBackground).not.toBe("");
  expect(styles.background).not.toBe("rgba(0, 0, 0, 0)");
  expect(styles.tapMin).toBeGreaterThan(0);
  expect(styles.buttonHeight).toBeGreaterThanOrEqual(styles.tapMin);

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow, "horizontal scroll").toBeLessThanOrEqual(0);

  expect(problems).toEqual([]);
}

test.describe("the POC's pages", { tag: "@sanity" }, () => {
  for (const { name, path, heading } of PAGES) {
    test(`PLT-009: ${name} renders properly`, async ({ page }) => {
      const problems = collectProblems(page);

      await page.goto(path);
      await page.waitForLoadState("networkidle");

      await expectRendersProperly(page, heading, problems);
    });
  }

  test("PLT-009: the live session renders properly", async ({ page }) => {
    const problems = collectProblems(page);
    await page.goto("/session/demo");
    await page.getByRole("button", { name: "Unirme al taller" }).click();

    await expect(page.getByRole("navigation", { name: "Controles de la llamada" })).toBeVisible();
    await expectRendersProperly(page, "Manejo de la ansiedad · Sesión 4 de 8", problems);
  });
});
