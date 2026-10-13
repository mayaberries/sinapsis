<script setup lang="ts">
import { useRoomStore, type Panel } from "../../stores/room";

const room = useRoomStore();

const panels: { panel: Panel; icon: string; label: string }[] = [
  { panel: "chat", icon: "💬", label: "Chat" },
  { panel: "people", icon: "👥", label: "Personas" },
  { panel: "materials", icon: "📁", label: "Materiales" },
];
</script>

<template>
  <nav
    class="controls"
    aria-label="Controles de la llamada"
  >
    <button
      class="control"
      :class="{ off: !room.micOn }"
      type="button"
      :aria-pressed="room.micOn"
      @click="room.toggleMic"
    >
      <span
        class="control-btn"
        aria-hidden="true"
      >🎙</span><span>Micrófono</span>
    </button>
    <button
      class="control"
      :class="{ off: !room.cameraOn }"
      type="button"
      :aria-pressed="room.cameraOn"
      @click="room.toggleCamera"
    >
      <span
        class="control-btn"
        aria-hidden="true"
      >📷</span><span>Cámara</span>
    </button>
    <button
      v-if="room.role === 'attendee'"
      class="control"
      :class="{ active: room.handRaised }"
      type="button"
      :aria-pressed="room.handRaised"
      @click="room.toggleHand"
    >
      <span
        class="control-btn"
        aria-hidden="true"
      >✋</span><span>{{ room.handRaised ? "Bajar la mano" : "Levantar la mano" }}</span>
    </button>
    <button
      v-else
      class="control"
      type="button"
    >
      <span
        class="control-btn"
        aria-hidden="true"
      >🖥</span><span>Compartir pantalla</span>
    </button>

    <span
      class="controls-divider"
      aria-hidden="true"
    />

    <button
      v-for="item in panels"
      :key="item.panel"
      class="control"
      :class="{ active: room.openPanel === item.panel }"
      type="button"
      :aria-pressed="room.openPanel === item.panel"
      @click="room.togglePanel(item.panel)"
    >
      <span
        class="control-btn"
        aria-hidden="true"
      >{{ item.icon }}</span><span>{{ item.label }}</span>
    </button>

    <span
      class="controls-divider"
      aria-hidden="true"
    />

    <a
      class="control leave"
      :href="room.role === 'host' ? '/panel' : '/'"
    >
      <span
        class="control-btn"
        aria-hidden="true"
      >✕</span><span>{{ room.role === "host" ? "Terminar la sesión" : "Salir" }}</span>
    </a>
  </nav>
</template>
