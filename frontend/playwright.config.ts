import { defineConfig, devices } from "@playwright/test";

const PORT = 4321;
const baseURL = `http://127.0.0.1:${PORT}`;

/**
 * End-to-end tests against the production build (the service worker and the
 * real bundles only exist there), on the reference device from
 * docs/DECISIONS.md: a Moto G4. Tests that need the real-conditions profile
 * (4× CPU, slow 3G) opt in with `test.use({ realConditions: true })`; see
 * tests/e2e/fixtures.ts.
 */
export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL,
    locale: "es-MX",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "moto-g4",
      use: { ...devices["Moto G4"] },
    },
  ],
  webServer: {
    command: "pnpm build && node dist/server/entry.mjs",
    url: baseURL,
    env: { HOST: "127.0.0.1", PORT: String(PORT) },
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
