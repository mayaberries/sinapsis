import { mount } from "@vue/test-utils";
import { afterEach, describe, expect, it } from "vitest";

import SessionRoom from "../../../src/islands/SessionRoom.vue";
import { $online } from "../../../src/shared/connection";
import { useRoomStore } from "../../../src/stores/room";
import { testingPinia } from "../_helpers/pinia";

function mountRoom() {
  return mount(SessionRoom, { global: { plugins: [testingPinia({ stubActions: false })] } });
}

describe("SessionRoom", () => {
  afterEach(() => {
    $online.set(true);
  });

  it("PLT-006: entering the session updates the room store", async () => {
    const wrapper = mountRoom();

    await wrapper.get("button").trigger("click");

    expect(useRoomStore().joined).toBe(true);
    expect(wrapper.text()).toContain("Estás en la sesión");
    expect(wrapper.find("button").exists()).toBe(false);
  });

  it("PLT-006: shows when the connection is lost, from the state shared across islands", async () => {
    const wrapper = mountRoom();
    expect(wrapper.text()).not.toContain("Sin conexión");

    $online.set(false);
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain("Sin conexión");
  });
});
