<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue'

defineProps<{ message: string; confirmLabel: string }>()
const emit = defineEmits<{ confirm: []; cancel: [] }>()

const dialog = useTemplateRef<HTMLDialogElement>('dialog')
let confirmed = false

function confirm() {
  confirmed = true
  emit('confirm')
  dialog.value?.close()
}

function closed() {
  if (!confirmed) emit('cancel')
}

function closeOnBackdrop(event: MouseEvent) {
  if (event.target === dialog.value) dialog.value?.close()
}

onMounted(() => dialog.value?.showModal())
</script>

<template>
  <dialog ref="dialog" @close="closed" @click="closeOnBackdrop">
    <div class="p-5">
      <p class="mb-5 text-lg font-semibold">{{ message }}</p>
      <div class="grid grid-cols-2 gap-3">
        <button type="button" class="btn" @click="dialog?.close()">Cancel</button>
        <button type="button" class="btn btn-danger" @click="confirm">{{ confirmLabel }}</button>
      </div>
    </div>
  </dialog>
</template>
