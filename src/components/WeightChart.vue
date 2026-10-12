<script setup lang="ts">
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart,
  LinearScale,
  LineElement,
  PointElement,
  type ChartData,
  type ChartOptions,
} from 'chart.js'
import type { WeightEntry } from '@/types'

Chart.register(LinearScale, LineElement, PointElement)

const props = defineProps<{ entries: WeightEntry[] }>()

const data = computed<ChartData<'line', { x: number; y: number }[]>>(() => ({
  datasets: [
    {
      data: props.entries.map((entry) => ({ x: Date.parse(entry.measuredAt), y: entry.weightKg })),
      borderColor: '#212529',
      backgroundColor: '#212529',
    },
  ],
}))

const options: ChartOptions<'line'> = {
  scales: {
    x: {
      type: 'linear',
      ticks: {
        stepSize: 86_400_000,
        callback: (value) =>
          new Date(value).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
      },
    },
    y: { title: { display: true, text: 'kg' } },
  },
}
</script>

<template>
  <Line :data="data" :options="options" />
</template>
