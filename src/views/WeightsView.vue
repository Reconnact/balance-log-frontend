<script setup lang="ts">
import { onMounted, ref } from 'vue'
import WeightChart from '@/components/WeightChart.vue'
import WeightList from '@/components/WeightList.vue'
import { listWeightEntries } from '@/api/weights'
import type { WeightEntry } from '@/types'

const entries = ref<WeightEntry[]>([])

onMounted(async () => {
  entries.value = await listWeightEntries()
})
</script>

<template>
  <h1 class="h3 mb-4">Weights</h1>
  <div class="mb-4">
    <WeightChart :entries="entries" />
  </div>
  <WeightList :entries="entries" />
</template>
