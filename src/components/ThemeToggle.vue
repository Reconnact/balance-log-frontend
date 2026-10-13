<script setup lang="ts">
import { computed } from 'vue'
import IconTheme from './icons/IconTheme.vue'
import { cycleTheme, theme } from '@/theme'

const labels = { system: 'System', light: 'Light', dark: 'Dark' }
const label = computed(() => labels[theme.value])
</script>

<template>
  <button type="button" :aria-label="`Theme: ${label}`" @click="cycleTheme">
    <IconTheme />
    <span>{{ label }}</span>
  </button>
</template>
