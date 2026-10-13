<script setup lang="ts">
import { computed } from 'vue'
import type { Progress } from '@/types'

const props = defineProps<{ progress: Progress }>()

const signed = new Intl.NumberFormat('en-GB', {
  signDisplay: 'exceptZero',
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
})

const row =
  'flex min-h-12 flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b border-line px-4 py-3 last:border-b-0'

const toGo = computed(() => {
  const kg = props.progress.kgToGo
  if (kg === 0) return 'Goal reached'
  return `${Math.abs(kg).toFixed(1)} kg to ${kg < 0 ? 'lose' : 'gain'}`
})
</script>

<template>
  <dl class="panel">
    <div class="border-b border-line px-4 pt-3 pb-4">
      <dt class="text-label font-medium text-muted">Latest</dt>
      <dd class="text-title font-bold">
        {{ progress.latestKg.toFixed(1) }} <span class="text-lg font-semibold text-muted">kg</span>
      </dd>
    </div>
    <div :class="row">
      <dt class="text-muted">Goal</dt>
      <dd class="font-semibold">{{ progress.targetKg.toFixed(1) }} kg</dd>
    </div>
    <div :class="row">
      <dt class="text-muted">To go</dt>
      <dd class="font-semibold">{{ toGo }}</dd>
    </div>
    <div :class="row">
      <dt class="text-muted">Trend, last 28 days</dt>
      <dd class="font-semibold">
        <template v-if="progress.kgPerWeek === null">
          No trend yet: log at least 2 weights over 7 days.
        </template>
        <template v-else>{{ signed.format(progress.kgPerWeek) }} kg per week</template>
      </dd>
    </div>
  </dl>
</template>
