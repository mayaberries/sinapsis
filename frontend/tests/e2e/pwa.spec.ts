import { expect, test } from "./fixtures";

type ManifestIcon = { src: string; sizes: string; type: string; purpose?: string };

test.describe("the installable app", () => {
  test("PLT-008: has a valid web app manifest", async ({ page, request }) => {
    await page.goto("/");
    const href = await page.locator('link[rel="manifest"]').getAttribute("href");
    expect(href).toBeTruthy();

    const response = await request.get(href!);
    expect(response.ok()).toBe(true);
    const manifest = await response.json();

    expect(manifest).toMatchObject({
      name: "Sinapsis",
      short_name: "Sinapsis",
      lang: "es",
      start_url: "/",
      display: "standalone",
    });
    expect(manifest.theme_color).toBeTruthy();

    const icons: ManifestIcon[] = manifest.icons;
    expect(icons.map((icon) => icon.sizes)).toEqual(expect.arrayContaining(["192x192", "512x512"]));
    expect(icons.some((icon) => icon.purpose === "maskable")).toBe(true);
    for (const icon of icons) {
      const image = await request.get(icon.src);
      expect(image.ok(), icon.src).toBe(true);
      expect(image.headers()["content-type"], icon.src).toContain("image/png");
    }
  });

  test("PLT-008: registers a service worker that controls the page", async ({ page }) => {
    await page.goto("/");

    const scope = await page.evaluate(async () => (await navigator.serviceWorker.ready).scope);
    expect(new URL(scope).pathname).toBe("/");

    // Once active, it controls every page loaded afterwards.
    await page.reload();
    expect(await page.evaluate(() => navigator.serviceWorker.controller !== null)).toBe(true);
  });

  test("PLT-008: Chromium finds the manifest and parses it without errors", async ({ page }) => {
    await page.goto("/");

    // Chromium's own manifest parser, which install prompts rely on. (Not
    // `Page.getInstallabilityErrors`: current Chromium reports none even
    // without a manifest, so it can't fail.)
    const cdp = await page.context().newCDPSession(page);
    const { url, errors } = await cdp.send("Page.getAppManifest");

    expect(new URL(url).pathname).toBe("/manifest.webmanifest");
    expect(errors).toEqual([]);
  });
});
