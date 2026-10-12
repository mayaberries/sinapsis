import { test as base, expect } from "@playwright/test";

/**
 * The real-conditions profile from docs/DECISIONS.md: 4× CPU throttling and a
 * slow 3G-like connection (about 400 kbps down and up, 400 ms latency).
 * Applied through the Chrome DevTools Protocol, so Chromium only (which the
 * Moto G4 project uses). Import `test` and `expect` from here, not from
 * @playwright/test.
 */
export const REAL_CONDITIONS = {
  cpuSlowdown: 4,
  latencyMs: 400,
  throughputBytesPerSecond: (400 * 1024) / 8,
} as const;

type Options = { realConditions: boolean };

export const test = base.extend<Options>({
  realConditions: [false, { option: true }],

  page: async ({ page, realConditions }, use) => {
    if (realConditions) {
      const cdp = await page.context().newCDPSession(page);
      await cdp.send("Emulation.setCPUThrottlingRate", { rate: REAL_CONDITIONS.cpuSlowdown });
      await cdp.send("Network.enable");
      await cdp.send("Network.emulateNetworkConditions", {
        offline: false,
        latency: REAL_CONDITIONS.latencyMs,
        downloadThroughput: REAL_CONDITIONS.throughputBytesPerSecond,
        uploadThroughput: REAL_CONDITIONS.throughputBytesPerSecond,
      });
    }
    await use(page);
  },
});

export { expect };
