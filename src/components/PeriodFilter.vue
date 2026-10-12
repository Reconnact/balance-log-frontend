<script setup lang="ts">
import type { Period } from '@/period'

const period = defineModel<Period>({ required: true })

const periods: Period[] = ['week', 'month', 'year', 'all']
</script>

<template>
  <div class="btn-group" role="group" aria-label="Period">
    <template v-for="option in periods" :key="option">
      <input
        :id="`period-${option}`"
        v-model="period"
        type="radio"
        class="btn-check"
        name="period"
        :value="option"
        autocomplete="off"
      />
      <label class="btn btn-outline-secondary text-capitalize" :for="`period-${option}`">
        {{ option }}
      </label>
    </template>
  </div>
</template>
