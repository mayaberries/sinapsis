/// <reference types="vitest/config" />
import { getViteConfig } from "astro/config";

// Astro's Vite config (so the Vue plugin and aliases match the app), plus
// Vitest's. Component tests live in tests/unit/, mirroring src/.
export default getViteConfig({
  test: {
    environment: "happy-dom",
    include: ["tests/unit/**/*.test.ts"],
  },
});
