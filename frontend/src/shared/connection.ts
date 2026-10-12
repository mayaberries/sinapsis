import { atom } from "nanostores";

// State shared across islands goes here, as nanostores; read it in Vue
// with `useStore` from @nanostores/vue.
export const $online = atom(typeof navigator === "undefined" ? true : navigator.onLine);

if (typeof window !== "undefined") {
  window.addEventListener("online", () => $online.set(true));
  window.addEventListener("offline", () => $online.set(false));
}
