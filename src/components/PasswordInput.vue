<script setup lang="ts">
import { ref } from 'vue'
import IconEye from './icons/IconEye.vue'

defineOptions({ inheritAttrs: false })

const model = defineModel<string>({ required: true })
const shown = ref(false)
</script>

<template>
  <div class="relative">
    <input
      v-bind="$attrs"
      v-model="model"
      :type="shown ? 'text' : 'password'"
      class="field pr-12"
    />
    <button
      type="button"
      class="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-xl text-muted aria-pressed:text-ink"
      aria-label="Show password"
      :aria-pressed="shown"
      @click="shown = !shown"
    >
      <IconEye />
    </button>
  </div>
</template>
