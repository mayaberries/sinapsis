// @ts-check
import { defineConfig } from "astro/config";

import node from "@astrojs/node";
import vue from "@astrojs/vue";

// Pages render on the server and ship no JavaScript unless they hold an
// island. The session room is the one big island (`client:only="vue"`).
export default defineConfig({
  output: "server",
  adapter: node({ mode: "standalone" }),
  // `appEntrypoint` installs Pinia on every Vue island's app.
  integrations: [vue({ appEntrypoint: "/src/app" })],
});
