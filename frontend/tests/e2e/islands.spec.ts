import { expect, test } from "./fixtures";

const SESSION_ROOM_CHUNK = /\/_astro\/SessionRoom\.[^/]+\.js$/;

test.describe("the session room island", () => {
  // Participants join from low-end phones on weak connections.
  test.use({ realConditions: true });

  test("PLT-006: hydrates with its store", async ({ page }) => {
    await page.goto("/session/demo");

    // A working click means the island hydrated and its Pinia store is live.
    await page.getByRole("button", { name: "Entrar" }).click();

    await expect(page.getByText("Estás en la sesión")).toBeVisible();
  });
});

test.describe("the session room's code", () => {
  test("PLT-006: loads on its page", async ({ page, scriptRequests }) => {
    await page.goto("/session/demo");
    await page.waitForLoadState("networkidle");

    expect(scriptRequests.some((url) => SESSION_ROOM_CHUNK.test(url))).toBe(true);
  });

  test("PLT-006: doesn't load on pages without it", async ({ page, scriptRequests }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    expect(scriptRequests.filter((url) => url.includes("/_astro/"))).toEqual([]);
  });
});
