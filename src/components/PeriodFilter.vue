<script setup lang="ts">
import type { Period } from '@/period'

const period = defineModel<Period>({ required: true })

const periods: Period[] = ['week', 'month', 'year', 'all']
</script>

<template>
  <div
    role="radiogroup"
    aria-label="Period"
    class="glass flex w-full gap-0.5 rounded-xl bg-line p-0.5 sm:inline-flex sm:w-auto"
  >
    <label
      v-for="option in periods"
      :key="option"
      :for="`period-${option}`"
      class="flex min-h-11 flex-1 cursor-pointer items-center justify-center rounded-[10px] px-5 font-medium capitalize text-ink has-checked:bg-white has-checked:shadow-[0_1px_3px_rgb(0_0_0/0.12)] has-focus-visible:outline-2 has-focus-visible:outline-accent has-focus-visible:outline-offset-2 dark:has-checked:bg-white/16"
    >
      <input
        :id="`period-${option}`"
        v-model="period"
        type="radio"
        class="sr-only"
        name="period"
        :value="option"
        autocomplete="off"
      />
      {{ option }}
    </label>
  </div>
</template>
