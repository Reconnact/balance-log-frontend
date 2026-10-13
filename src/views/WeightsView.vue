<script setup lang="ts">
import { nextTick, onMounted, ref, useTemplateRef, watch } from 'vue'
import { isAxiosError } from 'axios'
import PeriodFilter from '@/components/PeriodFilter.vue'
import WeightChart from '@/components/WeightChart.vue'
import WeightForm from '@/components/WeightForm.vue'
import WeightList from '@/components/WeightList.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import IconPlus from '@/components/icons/IconPlus.vue'
import { deleteWeightEntry, listWeightEntries } from '@/api/weights'
import { getGoal } from '@/api/goal'
import { menuOpen } from '@/menu'
import { periodFrom, type Period } from '@/period'
import { formatDate, formatKg } from '@/format'
import { showToast } from '@/toasts'
import type { Goal, WeightEntry } from '@/types'

const entries = ref<WeightEntry[]>([])
const state = ref<'loading' | 'loaded' | 'failed'>('loading')
const period = ref<Period>('all')
const goal = ref<Goal | null>()
const form = ref<{ entry?: WeightEntry }>()
const dialog = useTemplateRef<HTMLDialogElement>('form-dialog')
const deleting = ref<WeightEntry>()

async function load() {
  try {
    entries.value = await listWeightEntries(periodFrom(period.value, new Date()))
    state.value = 'loaded'
  } catch (error) {
    if (!isAxiosError(error)) throw error
    state.value = 'failed'
  }
}

function retry() {
  state.value = 'loading'
  load()
}

// showModal focuses the first field, so the form has to be rendered first
async function open(entry?: WeightEntry) {
  menuOpen.value = false
  form.value = { entry }
  await nextTick()
  dialog.value?.showModal()
}

async function saved() {
  showToast(form.value?.entry ? 'Entry saved' : 'Weight logged')
  dialog.value?.close()
  await load()
}

function closeOnBackdrop(event: MouseEvent) {
  if (event.target === dialog.value) dialog.value?.close()
}

async function remove(entry: WeightEntry) {
  deleting.value = undefined
  await deleteWeightEntry(entry.id)
  showToast('Entry deleted')
  await load()
}

onMounted(load)
onMounted(async () => {
  goal.value = await getGoal()
})
watch(period, load)
</script>

<template>
  <div class="mb-5 flex items-center justify-between">
    <h1 class="text-title font-bold sm:text-3xl">Weights</h1>
    <button type="button" class="btn btn-primary hidden sm:inline-flex" @click="open()">
      Log weight
    </button>
  </div>
  <div class="mb-4">
    <PeriodFilter v-model="period" />
  </div>
  <section :aria-busy="state === 'loading'" class="flex flex-col gap-4 pb-20 sm:pb-0">
    <template v-if="state === 'loading'">
      <div
        class="panel h-[252px] animate-pulse motion-reduce:animate-none sm:h-[332px]"
        aria-hidden="true"
      ></div>
      <div class="panel h-40 animate-pulse motion-reduce:animate-none" aria-hidden="true"></div>
    </template>
    <div v-else-if="state === 'failed'" class="panel px-4 py-6 text-center">
      <p class="mb-4 text-muted">Not loaded.</p>
      <button type="button" class="btn" @click="retry">Try again</button>
    </div>
    <template v-else>
      <div v-if="entries.length" class="panel p-4">
        <WeightChart :entries="entries" :target-kg="goal?.targetKg" />
      </div>
      <WeightList :entries="entries" @edit="open" @delete="deleting = $event" />
    </template>
  </section>

  <button
    type="button"
    class="btn btn-primary fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-20 rounded-full transition-all duration-100 sm:hidden"
    :class="menuOpen ? 'h-11 w-[calc(50%-1.5rem)]' : 'size-14 p-0 shadow-lg'"
    aria-label="Log weight"
    @click="open()"
  >
    <span v-if="menuOpen">Log weight</span>
    <IconPlus v-else />
  </button>

  <dialog ref="form-dialog" @close="form = undefined" @click="closeOnBackdrop">
    <div v-if="form" class="p-5">
      <h2 class="mb-4 text-xl font-bold">{{ form.entry ? 'Edit entry' : 'Log weight' }}</h2>
      <WeightForm
        :entry="form.entry"
        :last-kg="entries[entries.length - 1]?.weightKg"
        @saved="saved"
        @cancel="dialog?.close()"
      />
    </div>
  </dialog>

  <ConfirmDialog
    v-if="deleting"
    :message="`Delete ${formatKg(deleting.weightKg)} from ${formatDate(deleting.measuredAt)}?`"
    confirm-label="Delete"
    @confirm="remove(deleting)"
    @cancel="deleting = undefined"
  />
</template>
