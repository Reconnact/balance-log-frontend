<script setup lang="ts">
import WeightChart from '@/components/WeightChart.vue'
import WeightList from '@/components/WeightList.vue'
import type { WeightEntry } from '@/types'

const entries: WeightEntry[] = [
  {
    id: '3f2b8c1e-6d4a-4f7e-9b2a-1c5d8e0f4a71',
    measuredAt: '2026-10-01T06:30:00Z',
    weightKg: 82.4,
  },
  {
    id: 'a9e47d20-1b6c-4c3f-8e5d-7f2a9b0c6d13',
    measuredAt: '2026-10-03T06:45:00Z',
    weightKg: 82.1,
  },
  {
    id: '71bf64ee-62e4-408e-b5df-5afbd1b76247',
    measuredAt: '2026-10-05T07:10:00Z',
    weightKg: 81.9,
  },
  {
    id: 'e076581b-33dc-462a-bbf1-865500cd1667',
    measuredAt: '2026-10-08T06:20:00Z',
    weightKg: 82.0,
  },
  {
    id: '00e94b85-63c4-4b65-ac03-3552ca86ec7c',
    measuredAt: '2026-10-10T06:55:00Z',
    weightKg: 81.6,
  },
]
</script>

<template>
  <h1 class="h3 mb-4">Weights</h1>
  <div class="mb-4">
    <WeightChart :entries="entries" />
  </div>
  <WeightList :entries="entries" />
</template>
