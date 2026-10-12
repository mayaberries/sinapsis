import { createTestingPinia, type TestingOptions } from "@pinia/testing";
import { vi } from "vitest";

/**
 * Islands get Pinia from src/app.ts, which Vitest doesn't run; pass this to
 * `mount(..., { global: { plugins: [testingPinia()] } })` instead. Actions are
 * stubbed by default: `testingPinia({ stubActions: false })` runs them.
 */
export function testingPinia(options: TestingOptions = {}) {
  return createTestingPinia({ createSpy: vi.fn, ...options });
}
