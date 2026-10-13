<script setup lang="ts">
import { facilitator, session } from "../../data/demo";
</script>

<template>
  <div class="stage">
    <span>{{ facilitator.name }} está presentando “{{ session.presenting }}”</span>
    <span class="name-tag">{{ facilitator.name }} (facilita)</span>
  </div>
</template>
