<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart,
  Filler,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  type ChartData,
  type ChartOptions,
} from 'chart.js'
import { formatDateTime, formatKg } from '@/format'
import { theme } from '@/theme'
import type { WeightEntry } from '@/types'

Chart.register(Filler, LinearScale, LineElement, PointElement, Tooltip)
Chart.defaults.font.family = "'Geist', system-ui, sans-serif"
Chart.defaults.font.size = 13

const props = defineProps<{ entries: WeightEntry[]; targetKg?: number }>()

const YEAR = 365 * 86_400_000

function mediaQuery(query: string) {
  const list = matchMedia(query)
  const matches = ref(list.matches)
  const update = () => (matches.value = list.matches)
  list.addEventListener('change', update)
  onBeforeUnmount(() => list.removeEventListener('change', update))
  return matches
}

const wide = mediaQuery('(min-width: 36rem)')
const systemDark = mediaQuery('(prefers-color-scheme: dark)')
const reducedMotion = mediaQuery('(prefers-reduced-motion: reduce)')

// canvas can't read CSS variables, so the tokens are read as strings
function readColors() {
  const style = getComputedStyle(document.documentElement)
  const token = (name: string) => style.getPropertyValue(`--color-${name}`).trim()
  return {
    accent: token('accent'),
    fill: token('chart-fill'),
    goal: token('goal-line'),
    grid: token('grid'),
    muted: token('muted'),
    ink: token('ink'),
    surface: token('surface-strong'),
    line: token('line'),
  }
}

const colors = ref(readColors())
// the theme store sets data-theme in its own watcher, read after it
watch([theme, systemDark], () => nextTick(() => (colors.value = readColors())))

const data = computed<ChartData<'line', { x: number; y: number }[]>>(() => {
  const points = props.entries.map((entry) => ({
    x: Date.parse(entry.measuredAt),
    y: entry.weightKg,
  }))
  const first = points[0]
  const last = points[points.length - 1]
  return {
    datasets: [
      {
        data: points,
        borderColor: colors.value.accent,
        borderWidth: 2,
        tension: 0,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHitRadius: 12,
        pointHoverBackgroundColor: colors.value.accent,
        pointHoverBorderColor: colors.value.surface,
        pointHoverBorderWidth: 2,
        fill: 'start',
        backgroundColor: colors.value.fill,
      },
      ...(props.targetKg !== undefined && first && last
        ? [
            {
              data: [
                { x: first.x, y: props.targetKg },
                { x: last.x, y: props.targetKg },
              ],
              borderColor: colors.value.goal,
              borderWidth: 1.5,
              borderDash: [6, 6],
              pointRadius: 0,
              pointHoverRadius: 0,
              fill: false,
            },
          ]
        : []),
    ],
  }
})

const options = computed<ChartOptions<'line'>>(() => ({
  responsive: true,
  maintainAspectRatio: false,
  animation: reducedMotion.value ? false : { duration: 300 },
  interaction: { mode: 'nearest', axis: 'x', intersect: false },
  scales: {
    x: {
      type: 'linear',
      bounds: 'data',
      border: { display: false },
      grid: { display: false },
      ticks: {
        maxTicksLimit: wide.value ? 7 : 4,
        maxRotation: 0,
        color: colors.value.muted,
        callback(value) {
          return new Date(Number(value)).toLocaleDateString(
            'en-GB',
            this.max - this.min > YEAR
              ? { month: 'short', year: 'numeric' }
              : { day: 'numeric', month: 'short' },
          )
        },
      },
    },
    y: {
      grace: 0.5,
      border: { display: false },
      grid: { color: colors.value.grid },
      ticks: { color: colors.value.muted },
    },
  },
  plugins: {
    tooltip: {
      filter: (item) => item.datasetIndex === 0,
      displayColors: false,
      backgroundColor: colors.value.surface,
      borderColor: colors.value.line,
      borderWidth: 1,
      cornerRadius: 12,
      padding: 10,
      titleColor: colors.value.muted,
      titleFont: { weight: 500 },
      bodyColor: colors.value.ink,
      bodyFont: { size: 16, weight: 600 },
      callbacks: {
        title: (items) =>
          items[0] ? formatDateTime(new Date(items[0].parsed.x!).toISOString()) : '',
        label: (item) => formatKg(item.parsed.y!),
      },
    },
  },
}))
</script>

<template>
  <div class="h-[220px] sm:h-[300px]">
    <Line :data="data" :options="options" />
  </div>
</template>
