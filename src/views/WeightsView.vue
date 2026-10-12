<script setup lang="ts">
import { nextTick, onMounted, ref, useTemplateRef, watch } from 'vue'
import PeriodFilter from '@/components/PeriodFilter.vue'
import WeightChart from '@/components/WeightChart.vue'
import WeightForm from '@/components/WeightForm.vue'
import WeightList from '@/components/WeightList.vue'
import { deleteWeightEntry, listWeightEntries } from '@/api/weights'
import { periodFrom, type Period } from '@/period'
import type { WeightEntry } from '@/types'

const entries = ref<WeightEntry[]>([])
const period = ref<Period>('all')
const form = ref<{ entry?: WeightEntry }>()
const dialog = useTemplateRef<HTMLDialogElement>('form-dialog')

async function load() {
  entries.value = await listWeightEntries(periodFrom(period.value, new Date()))
}

// showModal focuses the first field, so the form has to be rendered first
async function open(entry?: WeightEntry) {
  form.value = { entry }
  await nextTick()
  dialog.value?.showModal()
}

async function saved() {
  dialog.value?.close()
  await load()
}

async function remove(entry: WeightEntry) {
  await deleteWeightEntry(entry.id)
  await load()
}

onMounted(load)
watch(period, load)
</script>

<template>
  <div class="d-flex justify-content-between align-items-center mb-4">
    <h1 class="h3 mb-0">Weights</h1>
    <button type="button" class="btn btn-dark" @click="open()">Log weight</button>
  </div>
  <div class="mb-3">
    <PeriodFilter v-model="period" />
  </div>
  <div class="mb-4">
    <WeightChart :entries="entries" />
  </div>
  <WeightList :entries="entries" @edit="open" @delete="remove" />

  <dialog ref="form-dialog" class="border-0 rounded-3 shadow p-4" @close="form = undefined">
    <template v-if="form">
      <h2 class="h5 mb-3">{{ form.entry ? 'Edit entry' : 'Log weight' }}</h2>
      <WeightForm :entry="form.entry" @saved="saved" @cancel="dialog?.close()" />
    </template>
  </dialog>
</template>
