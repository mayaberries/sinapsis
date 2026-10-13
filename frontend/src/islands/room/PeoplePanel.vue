<script setup lang="ts">
import { facilitator, session } from "../../data/demo";
import { useRoomStore } from "../../stores/room";
import SidePanel from "./SidePanel.vue";

const room = useRoomStore();
const others = session.participants.filter((person) => person.name !== "Tú");
</script>

<template>
  <SidePanel :title="`Personas (${session.participants.length + 1})`">
    <template v-if="room.role === 'host'">
      <p class="panel-section-title">
        Esperando para entrar ({{ session.waiting.length }})
      </p>
      <ul class="row-list">
        <li
          v-for="name in session.waiting"
          :key="name"
        >
          <span>{{ name }}</span>
          <span class="row-actions">
            <button
              class="btn btn-primary btn-small"
              type="button"
            >Admitir</button>
            <button
              class="btn btn-secondary btn-small"
              type="button"
            >Rechazar</button>
          </span>
        </li>
      </ul>
      <button
        class="btn btn-secondary btn-small mute-all"
        type="button"
      >
        Silenciar a todos
      </button>
    </template>

    <p class="panel-section-title in-session">
      En la sesión
    </p>
    <ul class="row-list">
      <li><span>{{ facilitator.name }} (facilita)</span></li>
      <li
        v-for="person in others"
        :key="person.name"
      >
        <span>{{ person.name }}{{ person.handRaised ? " ✋" : "" }}</span>
        <span
          v-if="room.role === 'host'"
          class="row-actions"
        >
          <button
            v-if="person.handRaised"
            class="btn btn-secondary btn-small"
            type="button"
          >Bajar la mano</button>
          <button
            class="btn btn-secondary btn-small"
            type="button"
            :aria-label="`Más opciones para ${person.name}`"
          >⋯</button>
        </span>
      </li>
    </ul>
  </SidePanel>
</template>

<style scoped>
.row-actions {
  display: flex;
  gap: 8px;
}
.mute-all {
  margin-top: 12px;
  width: 100%;
}
.in-session {
  margin-top: 20px;
}
</style>
