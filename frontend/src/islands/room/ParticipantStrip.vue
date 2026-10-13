<script setup lang="ts">
import { session } from "../../data/demo";
import { useRoomStore } from "../../stores/room";

const room = useRoomStore();
</script>

<template>
  <ul
    class="strip"
    aria-label="Participantes"
  >
    <li
      v-for="person in session.participants"
      :key="person.name"
      class="tile"
      :class="{ speaking: person.speaking }"
    >
      <div class="avatar">
        {{ person.initial }}
      </div>
      <span class="name-tag">
        {{ person.name }}{{ person.handRaised || (person.name === "Tú" && room.handRaised) ? " ✋" : "" }}
      </span>
    </li>
  </ul>
</template>
