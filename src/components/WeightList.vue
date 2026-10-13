<script setup lang="ts">
import IconDelete from './icons/IconDelete.vue'
import IconEdit from './icons/IconEdit.vue'
import { formatDate, formatDateTime, formatKg } from '@/format'
import type { WeightEntry } from '@/types'

defineProps<{ entries: WeightEntry[] }>()
const emit = defineEmits<{ edit: [entry: WeightEntry]; delete: [entry: WeightEntry] }>()

function name(entry: WeightEntry) {
  return `${formatKg(entry.weightKg)}, ${formatDate(entry.measuredAt)}`
}

const icon =
  'inline-flex size-11 items-center justify-center rounded-xl border-0 bg-transparent text-muted hover:text-ink'
</script>

<template>
  <ul v-if="entries.length" class="panel m-0 list-none p-0">
    <li
      v-for="entry in entries"
      :key="entry.id"
      class="grid grid-cols-[1fr_auto] items-center gap-x-4 border-b border-line py-1.5 pr-1.5 pl-4 last:border-b-0 sm:grid-cols-[1fr_auto_auto]"
    >
      <span class="col-start-1 row-start-1 text-lg font-semibold sm:col-start-2 sm:text-right">
        {{ formatKg(entry.weightKg) }}
      </span>
      <span class="col-start-1 row-start-2 text-muted sm:row-start-1">
        {{ formatDateTime(entry.measuredAt) }}
      </span>
      <span class="col-start-2 row-span-2 row-start-1 flex sm:col-start-3 sm:row-span-1">
        <button
          type="button"
          :class="icon"
          :aria-label="`Edit ${name(entry)}`"
          @click="emit('edit', entry)"
        >
          <IconEdit />
        </button>
        <button
          type="button"
          :class="icon"
          :aria-label="`Delete ${name(entry)}`"
          @click="emit('delete', entry)"
        >
          <IconDelete />
        </button>
      </span>
    </li>
  </ul>
  <p v-else class="text-body-secondary">No entries yet.</p>
</template>
