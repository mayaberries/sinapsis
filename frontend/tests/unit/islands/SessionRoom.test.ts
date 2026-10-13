import { mount } from "@vue/test-utils";
import { afterEach, describe, expect, it } from "vitest";

import SessionRoom from "../../../src/islands/SessionRoom.vue";
import { $online } from "../../../src/shared/connection";
import { useRoomStore, type Role } from "../../../src/stores/room";
import { testingPinia } from "../_helpers/pinia";

function mountRoom(roomRole: Role = "attendee") {
  return mount(SessionRoom, {
    props: { roomRole },
    global: { plugins: [testingPinia({ stubActions: false })] },
  });
}

describe("SessionRoom", { tags: ["sanity"] }, () => {
  afterEach(() => {
    $online.set(true);
  });

  it("PLT-006: joining from the device check updates the room store", async () => {
    const wrapper = mountRoom();

    await wrapper.get("button.btn-primary").trigger("click");

    expect(useRoomStore().screen).toBe("session");
    expect(wrapper.get("h1").text()).toBe("Manejo de la ansiedad · Sesión 4 de 8");
  });

  it("PLT-006: takes its role from the page", () => {
    const wrapper = mountRoom("host");

    expect(useRoomStore().role).toBe("host");
    expect(wrapper.get("button.btn-primary").text()).toBe("Empezar la sesión");
  });

  it("PLT-006: shows when the connection is lost, from the state shared across islands", async () => {
    const wrapper = mountRoom();
    expect(wrapper.text()).not.toContain("Sin conexión");

    $online.set(false);
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain("Sin conexión");
  });
});
