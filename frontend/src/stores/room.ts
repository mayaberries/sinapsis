import { defineStore } from "pinia";
import { ref } from "vue";

export const useRoomStore = defineStore("room", () => {
  const joined = ref(false);

  function join() {
    joined.value = true;
  }

  return { joined, join };
});
