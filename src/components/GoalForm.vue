<script setup lang="ts">
import { ref } from 'vue'
import { isAxiosError } from 'axios'
import { setGoal } from '@/api/goal'
import { weightKgError } from '@/validation'
import type { Goal } from '@/types'

const props = defineProps<{ targetKg?: number }>()
const emit = defineEmits<{ saved: [goal: Goal] }>()

const targetKg = ref<number | ''>(props.targetKg ?? '')
const error = ref<string>()

async function submit() {
  error.value = weightKgError(targetKg.value)
  if (error.value) return

  try {
    emit('saved', await setGoal(targetKg.value as number))
  } catch (e) {
    if (isAxiosError(e) && e.response?.status === 400) error.value = e.response.data.errors.targetKg
    else throw e
  }
}
</script>

<template>
  <form novalidate @submit.prevent="submit">
    <label for="targetKg" class="form-label">Goal weight (kg)</label>
    <div class="row g-2 align-items-start">
      <div class="col-sm-4">
        <input
          id="targetKg"
          v-model="targetKg"
          type="number"
          step="0.1"
          inputmode="decimal"
          class="form-control"
          :class="{ 'is-invalid': error }"
        />
        <div class="invalid-feedback">{{ error }}</div>
      </div>
      <div class="col-auto">
        <button type="submit" class="btn btn-dark">Set goal</button>
      </div>
    </div>
  </form>
</template>
