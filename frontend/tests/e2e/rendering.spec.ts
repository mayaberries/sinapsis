import { expect, test } from "./fixtures";

test.describe("a page with no island", () => {
  test("PLT-005: is rendered on the server", async ({ request }) => {
    // Raw HTML, no browser: the content must already be there.
    const response = await request.get("/");

    expect(response.ok()).toBe(true);
    expect(await response.text()).toMatch(/<h1[^>]*>\s*Sinapsis\s*<\/h1>/);
  });

  test.describe("with JavaScript disabled", () => {
    test.use({ javaScriptEnabled: false });

    test("PLT-005: still shows its content", async ({ page }) => {
      await page.goto("/");

      await expect(page.getByRole("heading", { level: 1, name: "Sinapsis" })).toBeVisible();
    });
  });

  test("PLT-005: loads no scripts", async ({ page, scriptRequests }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // The inline service worker registration isn't a request; anything from
    // /_astro/ would be an island or framework bundle.
    expect(scriptRequests).toEqual([]);
    await expect(page.locator("astro-island")).toHaveCount(0);
  });
});
