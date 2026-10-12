<script setup lang="ts">
import { ref } from 'vue'
import { isAxiosError } from 'axios'
import { createWeightEntry, updateWeightEntry } from '@/api/weights'
import { measuredAtError, weightKgError } from '@/validation'
import type { WeightEntry } from '@/types'

const props = defineProps<{ entry?: WeightEntry }>()
const emit = defineEmits<{ saved: [entry: WeightEntry]; cancel: [] }>()

const weightKg = ref<number | ''>(props.entry?.weightKg ?? '')
const measuredAt = ref(toLocalInput(props.entry?.measuredAt ?? new Date().toISOString()))
const errors = ref<Record<string, string | undefined>>({})

// datetime-local wants local time without a zone, toISOString gives UTC
function toLocalInput(iso: string) {
  const date = new Date(iso)
  return new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString().slice(0, 16)
}

async function submit() {
  errors.value = {
    weightKg: weightKgError(weightKg.value),
    measuredAt: measuredAtError(measuredAt.value, props.entry !== undefined),
  }
  if (errors.value.weightKg || errors.value.measuredAt) return

  const request = {
    weightKg: weightKg.value as number,
    measuredAt: measuredAt.value ? new Date(measuredAt.value).toISOString() : undefined,
  }
  try {
    emit(
      'saved',
      props.entry
        ? await updateWeightEntry(props.entry.id, request)
        : await createWeightEntry(request),
    )
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 400)
      errors.value = error.response.data.errors
    else throw error
  }
}
</script>

<template>
  <form novalidate @submit.prevent="submit">
    <div class="row g-3 align-items-start">
      <div class="col-sm">
        <label for="weightKg" class="form-label">Weight (kg)</label>
        <input
          id="weightKg"
          v-model="weightKg"
          type="number"
          step="0.1"
          inputmode="decimal"
          class="form-control"
          :class="{ 'is-invalid': errors.weightKg }"
        />
        <div class="invalid-feedback">{{ errors.weightKg }}</div>
      </div>
      <div class="col-sm">
        <label for="measuredAt" class="form-label">Measured</label>
        <input
          id="measuredAt"
          v-model="measuredAt"
          type="datetime-local"
          class="form-control"
          :class="{ 'is-invalid': errors.measuredAt }"
        />
        <div class="invalid-feedback">{{ errors.measuredAt }}</div>
      </div>
    </div>
    <div class="d-flex gap-2 mt-3">
      <button type="submit" class="btn btn-dark">{{ entry ? 'Save' : 'Log' }}</button>
      <button type="button" class="btn btn-outline-secondary" @click="emit('cancel')">
        Cancel
      </button>
    </div>
  </form>
</template>
