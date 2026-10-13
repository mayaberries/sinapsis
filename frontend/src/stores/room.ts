import { defineStore } from "pinia";
import { ref } from "vue";

/** Who's in the room: the facilitator hosts, participants attend. */
export type Role = "host" | "attendee";

/** The device check before entering, then the live session. */
export type Screen = "check" | "session";

export type Panel = "chat" | "people" | "materials";

export const useRoomStore = defineStore("room", () => {
  const role = ref<Role>("attendee");
  const screen = ref<Screen>("check");
  /** One side panel open at a time, or none. */
  const openPanel = ref<Panel | null>(null);
  const micOn = ref(true);
  const cameraOn = ref(false);
  const handRaised = ref(false);

  function join() {
    screen.value = "session";
  }

  function togglePanel(panel: Panel) {
    openPanel.value = openPanel.value === panel ? null : panel;
  }

  function closePanel() {
    openPanel.value = null;
  }

  function toggleMic() {
    micOn.value = !micOn.value;
  }

  function toggleCamera() {
    cameraOn.value = !cameraOn.value;
  }

  function toggleHand() {
    handRaised.value = !handRaised.value;
  }

  return {
    role,
    screen,
    openPanel,
    micOn,
    cameraOn,
    handRaised,
    join,
    togglePanel,
    closePanel,
    toggleMic,
    toggleCamera,
    toggleHand,
  };
});
