<script setup lang="ts">
import { slowRequests } from '@/api/client'
</script>

<template>
  <div v-if="slowRequests > 0" class="mx-auto max-w-content px-4 pt-4">
    <p
      role="status"
      class="glass m-0 rounded-xl border-[1px] border-line bg-surface-strong px-4 py-3 text-ink"
    >
      Starting the server. On the free plan this takes up to 90 seconds.
    </p>
  </div>
</template>
