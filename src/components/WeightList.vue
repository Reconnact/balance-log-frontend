<script setup lang="ts">
import type { WeightEntry } from '@/types'

defineProps<{ entries: WeightEntry[] }>()

function formatDate(measuredAt: string) {
  return new Date(measuredAt).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })
}
</script>

<template>
  <table v-if="entries.length" class="table">
    <thead>
      <tr>
        <th>Measured</th>
        <th class="text-end">Weight</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="entry in entries" :key="entry.id">
        <td>{{ formatDate(entry.measuredAt) }}</td>
        <td class="text-end">{{ entry.weightKg.toFixed(1) }} kg</td>
      </tr>
    </tbody>
  </table>
  <p v-else class="text-body-secondary">No entries yet.</p>
</template>
