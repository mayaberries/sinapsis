# Frontend tests

- `unit/`: Vitest + Vue Test Utils component tests, mirroring `src/` (e.g. `unit/islands/SessionRoom.test.ts`). `*.test-d.ts` are type tests: `vue-tsc` checks them, nothing runs them. Islands get Pinia from `src/app.ts`, which Vitest doesn't run: mount them with `createTestingPinia` from `@pinia/testing`.
- `e2e/`: Playwright, against the production build on the Moto G4 profile. Import `test` and `expect` from `e2e/fixtures.ts`; `test.use({ realConditions: true })` adds the throttled profile.

Name every test by its test ID: `test("PLT-005: …")`, so `pnpm test:unit -t PLT-005` or `pnpm test:e2e --grep PLT-005` runs one case.

Tag quick platform checks as sanity: `describe("…", { tags: ["sanity"] }, …)` in Vitest (tags are declared in `vitest.config.ts`; undeclared ones are an error) and `test.describe("…", { tag: "@sanity" }, …)` in Playwright. Run only them with `pnpm test:unit --tags-filter sanity` or `pnpm test:e2e --grep @sanity` (`make test-sanity` runs every suite's).
