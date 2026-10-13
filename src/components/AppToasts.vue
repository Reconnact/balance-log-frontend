<script setup lang="ts">
import { toasts } from '@/toasts'
</script>

<template>
  <TransitionGroup
    tag="ul"
    aria-live="polite"
    class="pointer-events-none fixed inset-x-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-30 m-0 flex list-none flex-col items-center gap-2 p-0"
    enter-from-class="opacity-0 translate-y-2"
    leave-to-class="opacity-0"
    enter-active-class="transition duration-200 motion-reduce:transition-none"
    leave-active-class="transition duration-200 motion-reduce:transition-none"
  >
    <li
      v-for="toast in toasts"
      :key="toast.id"
      class="glass max-w-sm rounded-xl border border-line bg-surface-strong px-4 py-3 text-ink shadow-lg"
      :class="{ 'border-l-4 border-l-danger': toast.kind === 'error' }"
    >
      {{ toast.text }}
    </li>
  </TransitionGroup>
</template>
