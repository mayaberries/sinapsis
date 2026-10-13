<script setup lang="ts">
import { session } from "../../data/demo";
import SidePanel from "./SidePanel.vue";
</script>

<template>
  <SidePanel title="Chat">
    <p
      v-for="(message, index) in session.chat"
      :key="index"
    >
      <strong>{{ message.author }}</strong><br>{{ message.text }}
    </p>
    <template #footer>
      <input
        class="input"
        type="text"
        placeholder="Escribe un mensaje"
        aria-label="Mensaje"
      >
      <button
        class="btn btn-primary"
        type="button"
      >
        Enviar
      </button>
    </template>
  </SidePanel>
</template>
