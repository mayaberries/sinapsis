/// <reference types="vitest/config" />
import { getViteConfig } from "astro/config";

// Astro's Vite config (so the Vue plugin and aliases match the app), plus
// Vitest's. Component tests live in tests/unit/, mirroring src/; type tests
// (`*.test-d.ts`) are checked by the compiler, not run.
export default getViteConfig({
  test: {
    environment: "happy-dom",
    include: ["tests/unit/**/*.test.ts"],
    // Tags a test can carry (`{ tags: ["sanity"] }`); an undeclared tag is an
    // error. Run one with `--tags-filter sanity`.
    tags: [
      {
        name: "sanity",
        description: "Quick checks that the platform itself works (islands, the typed API client).",
      },
    ],
    typecheck: {
      enabled: true,
      include: ["tests/unit/**/*.test-d.ts"],
      // vue-tsc instead of tsc, so imports of .vue files resolve.
      checker: "vue-tsc",
      tsconfig: "./tsconfig.json",
    },
  },
});
