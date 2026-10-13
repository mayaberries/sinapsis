<script setup lang="ts">
import { useRoomStore } from "../../stores/room";

defineProps<{ title: string }>();

const room = useRoomStore();
</script>

<template>
  <aside
    class="side-panel"
    :aria-label="title"
  >
    <div class="panel-header">
      <h2>{{ title }}</h2>
      <button
        class="btn btn-secondary btn-small"
        type="button"
        @click="room.closePanel"
      >
        Cerrar
      </button>
    </div>
    <div class="panel-body">
      <slot />
    </div>
    <div
      v-if="$slots.footer"
      class="panel-footer"
    >
      <slot name="footer" />
    </div>
  </aside>
</template>
