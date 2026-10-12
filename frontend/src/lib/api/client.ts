import createClient from "openapi-fetch";

import type { paths } from "./schema";

// Typed against the backend's OpenAPI schema: run `make gen-api` after
// changing the API.
export const api = createClient<paths>({
  baseUrl: import.meta.env.PUBLIC_API_URL ?? "http://localhost:8000",
});
