<script setup lang="ts">
import { facilitator, session } from "../../data/demo";
import { useRoomStore } from "../../stores/room";

const room = useRoomStore();
const waiting = session.participants.length;
</script>

<template>
  <section
    class="check"
    aria-label="Revisa tu cámara y micrófono"
  >
    <div class="check-layout">
      <div class="preview">
        <span class="preview-label">{{ room.cameraOn ? "Tu cámara" : "Cámara apagada" }}</span>
        <div class="preview-controls">
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
            >🎙</span>
            <span>Micrófono</span>
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
            >📷</span>
            <span>Cámara</span>
          </button>
        </div>
      </div>

      <div class="check-side">
        <div>
          <h1>{{ session.workshop }}</h1>
          <p class="muted">
            {{ session.label }}
          </p>
          <p
            v-if="room.role === 'host'"
            class="muted"
          >
            {{ waiting }} participantes te están esperando
          </p>
          <p
            v-else
            class="muted"
          >
            Facilita {{ facilitator.name }} · {{ waiting }} personas ya están aquí
          </p>
        </div>

        <div class="device-row">
          <label
            class="label"
            for="mic-select"
          >Micrófono</label>
          <select
            id="mic-select"
            class="input"
          >
            <option>Micrófono del teléfono</option>
          </select>
        </div>
        <div class="device-row">
          <label
            class="label"
            for="cam-select"
          >Cámara</label>
          <select
            id="cam-select"
            class="input"
          >
            <option>Cámara frontal</option>
          </select>
        </div>

        <button
          class="btn btn-primary"
          type="button"
          @click="room.join"
        >
          {{ room.role === "host" ? "Empezar la sesión" : "Unirme al taller" }}
        </button>
        <a
          class="btn btn-secondary"
          :href="room.role === 'host' ? '/panel' : '/'"
        >
          {{ room.role === "host" ? "Volver al panel" : "Volver" }}
        </a>
      </div>
    </div>
  </section>
</template>
