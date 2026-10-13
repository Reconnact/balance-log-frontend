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
const saving = ref(false)

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
  saving.value = true
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
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <form novalidate class="flex flex-col gap-4" @submit.prevent="submit">
    <div>
      <label for="weightKg" class="mb-1.5 block text-label font-medium text-muted">
        Weight (kg)
      </label>
      <input
        id="weightKg"
        v-model="weightKg"
        type="number"
        step="0.1"
        inputmode="decimal"
        class="field"
        :aria-invalid="!!errors.weightKg"
        :aria-describedby="errors.weightKg ? 'weightKg-error' : undefined"
      />
      <p v-if="errors.weightKg" id="weightKg-error" class="mt-1.5 mb-0 text-label text-danger">
        {{ errors.weightKg }}
      </p>
    </div>
    <div>
      <label for="measuredAt" class="mb-1.5 block text-label font-medium text-muted">
        Measured
      </label>
      <input
        id="measuredAt"
        v-model="measuredAt"
        type="datetime-local"
        class="field"
        :aria-invalid="!!errors.measuredAt"
        :aria-describedby="errors.measuredAt ? 'measuredAt-error' : undefined"
      />
      <p v-if="errors.measuredAt" id="measuredAt-error" class="mt-1.5 mb-0 text-label text-danger">
        {{ errors.measuredAt }}
      </p>
    </div>
    <div class="mt-1 grid grid-cols-2 gap-3">
      <button type="button" class="btn" @click="emit('cancel')">Cancel</button>
      <button type="submit" class="btn btn-primary" :disabled="saving" :aria-busy="saving">
        {{ entry ? 'Save' : 'Log' }}
      </button>
    </div>
  </form>
</template>
