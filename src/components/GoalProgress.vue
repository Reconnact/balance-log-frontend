<script setup lang="ts">
import { computed } from 'vue'
import type { Progress } from '@/types'

const props = defineProps<{ progress: Progress }>()

const signed = new Intl.NumberFormat('en-GB', {
  signDisplay: 'exceptZero',
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
})

const toGo = computed(() => {
  const kg = props.progress.kgToGo
  if (kg === 0) return 'Goal reached'
  return `${Math.abs(kg).toFixed(1)} kg to ${kg < 0 ? 'lose' : 'gain'}`
})
</script>

<template>
  <dl class="row mb-0">
    <dt class="col-sm-3">Latest</dt>
    <dd class="col-sm-9">{{ progress.latestKg.toFixed(1) }} kg</dd>
    <dt class="col-sm-3">Goal</dt>
    <dd class="col-sm-9">{{ progress.targetKg.toFixed(1) }} kg</dd>
    <dt class="col-sm-3">To go</dt>
    <dd class="col-sm-9">{{ toGo }}</dd>
    <dt class="col-sm-3">Trend, last 28 days</dt>
    <dd class="col-sm-9">
      <template v-if="progress.kgPerWeek === null">
        No trend yet: log at least 2 weights over 7 days.
      </template>
      <template v-else>{{ signed.format(progress.kgPerWeek) }} kg per week</template>
    </dd>
  </dl>
</template>
