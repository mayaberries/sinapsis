import { describe, expectTypeOf, it } from "vitest";

import { api } from "../../../../src/lib/api/client";

// Type tests: checked by the compiler (`vitest --typecheck`), never run.
describe("the typed API client", { tags: ["sanity"] }, () => {
  it("PLT-007: knows the health route and its response", async () => {
    type Health = {
      status: "ok" | "unavailable";
      checks: { [key: string]: "ok" | "unreachable" };
    };

    const { data } = await api.GET("/health");

    expectTypeOf(data).toEqualTypeOf<Health | undefined>();
  });

  it("PLT-007: rejects routes the API doesn't have", () => {
    // @ts-expect-error: no such route in the OpenAPI schema
    void api.GET("/healthz");
  });
});
