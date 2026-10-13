<script setup lang="ts">
import { toasts } from '@/toasts'
</script>

<template>
  <TransitionGroup
    tag="ul"
    aria-live="polite"
    class="pointer-events-none fixed inset-x-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-30 flex flex-col items-end gap-2"
    enter-from-class="opacity-0 translate-y-2"
    leave-to-class="opacity-0"
    enter-active-class="transition duration-200 motion-reduce:transition-none"
    leave-active-class="transition duration-200 motion-reduce:transition-none"
  >
    <li
      v-for="toast in toasts"
      :key="toast.id"
      class="glass relative max-w-sm overflow-hidden rounded-xl border border-l-0 border-line bg-surface-strong py-3 pr-4 pl-5 text-ink shadow-lg before:absolute before:inset-y-0 before:left-0 before:w-1"
      :class="toast.kind === 'success' ? 'before:bg-success' : 'before:bg-danger'"
    >
      {{ toast.text }}
    </li>
  </TransitionGroup>
</template>
