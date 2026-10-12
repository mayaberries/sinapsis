<script setup lang="ts">
import { useStore } from "@nanostores/vue";

import { $online } from "../shared/connection";
import { useRoomStore } from "../stores/room";

const room = useRoomStore();
const online = useStore($online);
</script>

<template>
  <main>
    <p v-if="!online">
      Sin conexión
    </p>
    <p v-if="room.joined">
      Estás en la sesión
    </p>
    <button
      v-else
      type="button"
      @click="room.join"
    >
      Entrar
    </button>
  </main>
</template>
