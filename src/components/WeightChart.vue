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

const props = defineProps<{ entries: WeightEntry[]; targetKg?: number }>()

const data = computed<ChartData<'line', { x: number; y: number }[]>>(() => {
  const points = props.entries.map((entry) => ({
    x: Date.parse(entry.measuredAt),
    y: entry.weightKg,
  }))
  const first = points[0]
  const last = points[points.length - 1]
  return {
    datasets: [
      { data: points, borderColor: '#212529', backgroundColor: '#212529' },
      ...(props.targetKg !== undefined && first && last
        ? [
            {
              data: [
                { x: first.x, y: props.targetKg },
                { x: last.x, y: props.targetKg },
              ],
              borderColor: '#adb5bd',
              borderDash: [6, 6],
              pointRadius: 0,
            },
          ]
        : []),
    ],
  }
})

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
