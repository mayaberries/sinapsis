<script setup lang="ts">
import { MATERIAL_ICONS, session } from "../../data/demo";
import { useRoomStore } from "../../stores/room";
import SidePanel from "./SidePanel.vue";

const room = useRoomStore();
</script>

<template>
  <SidePanel title="Materiales">
    <p class="panel-section-title">
      Para esta sesión
    </p>
    <ul class="row-list">
      <li
        v-for="material in session.materials"
        :key="material.name"
      >
        <span>{{ MATERIAL_ICONS[material.kind] }} {{ material.name }}</span>
        <template v-if="room.role === 'host'">
          <button
            v-if="material.name === session.presenting"
            class="btn btn-secondary btn-small"
            type="button"
          >
            Presentando
          </button>
          <button
            v-else
            class="btn btn-primary btn-small"
            type="button"
          >
            Presentar
          </button>
        </template>
        <button
          v-else
          class="btn btn-secondary btn-small"
          type="button"
        >
          Descargar
        </button>
      </li>
    </ul>
    <p
      v-if="room.role === 'host'"
      class="muted panel-note"
    >
      Los participantes pueden descargar los materiales de esta sesión. Adminístralos desde tu panel.
    </p>
  </SidePanel>
</template>

<style scoped>
.panel-note {
  margin-top: 16px;
  font-size: 16px;
}
</style>
