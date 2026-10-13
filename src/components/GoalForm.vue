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
const saving = ref(false)

async function submit() {
  error.value = weightKgError(targetKg.value)
  if (error.value) return

  saving.value = true
  try {
    emit('saved', await setGoal(targetKg.value as number))
  } catch (e) {
    if (isAxiosError(e) && e.response?.status === 400) error.value = e.response.data.errors.targetKg
    else throw e
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <form novalidate @submit.prevent="submit">
    <label for="targetKg" class="mb-1.5 block text-label font-medium text-muted">
      Goal weight (kg)
    </label>
    <div class="flex gap-3">
      <input
        id="targetKg"
        v-model="targetKg"
        type="number"
        step="0.1"
        inputmode="decimal"
        class="field min-w-0 flex-1 sm:max-w-60"
        :aria-invalid="!!error"
        :aria-describedby="error ? 'targetKg-error' : undefined"
      />
      <button type="submit" class="btn btn-primary" :disabled="saving" :aria-busy="saving">
        Set goal
      </button>
    </div>
    <p v-if="error" id="targetKg-error" class="mt-1.5 mb-0 text-label text-danger">{{ error }}</p>
  </form>
</template>
