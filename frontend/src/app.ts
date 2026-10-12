import { createPinia } from "pinia";
import type { App } from "vue";

// Runs once per Vue island. Each island gets its own Pinia; state shared
// across islands goes in nanostores (src/shared/).
export default (app: App) => {
  app.use(createPinia());
};
