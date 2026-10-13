<script setup lang="ts">
import { useStore } from "@nanostores/vue";
import { storeToRefs } from "pinia";

import { session } from "../data/demo";
import { $online } from "../shared/connection";
import { useRoomStore, type Role } from "../stores/room";
import ChatPanel from "./room/ChatPanel.vue";
import ControlBar from "./room/ControlBar.vue";
import MaterialsPanel from "./room/MaterialsPanel.vue";
import ParticipantStrip from "./room/ParticipantStrip.vue";
import PeoplePanel from "./room/PeoplePanel.vue";
import PreJoinCheck from "./room/PreJoinCheck.vue";
import SessionStage from "./room/SessionStage.vue";

// Not `role`: that's the HTML attribute every component accepts, typed as
// an ARIA role.
const props = defineProps<{ roomRole: Role }>();

const room = useRoomStore();
room.role = props.roomRole;
const { screen, openPanel } = storeToRefs(room);
const online = useStore($online);
</script>

<template>
  <main class="room">
    <p
      v-if="!online"
      class="offline-banner"
      role="status"
    >
      Sin conexión
    </p>

    <PreJoinCheck v-if="screen === 'check'" />

    <section
      v-else
      class="session"
      aria-label="Sesión del taller"
    >
      <header class="session-header">
        <div>
          <h1>{{ session.workshop }} · {{ session.label }}</h1>
          <span class="muted">Código: {{ session.code }} · {{ session.elapsed }} transcurridos</span>
        </div>
        <div>
          <span class="muted">{{ session.participants.length + 1 }} participantes</span>
          <span
            v-if="room.role === 'host'"
            class="tag tag-live host-tag"
          >Tú facilitas</span>
        </div>
      </header>

      <div class="session-body">
        <div class="stage-area">
          <SessionStage />
          <ParticipantStrip />
        </div>
        <ChatPanel v-if="openPanel === 'chat'" />
        <PeoplePanel v-else-if="openPanel === 'people'" />
        <MaterialsPanel v-else-if="openPanel === 'materials'" />
      </div>

      <ControlBar />
    </section>
  </main>
</template>

<style scoped>
.host-tag {
  margin-left: 8px;
}
</style>
