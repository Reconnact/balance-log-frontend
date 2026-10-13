<script setup lang="ts">
import IconMinus from './icons/IconMinus.vue'
import IconPlus from './icons/IconPlus.vue'

defineOptions({ inheritAttrs: false })

const model = defineModel<number | ''>({ required: true })

function stepUp() {
  if (model.value !== '') model.value = Math.floor(model.value) + 1
}

function stepDown() {
  if (model.value !== '') model.value = Math.ceil(model.value) - 1
}

const step = 'flex w-11 items-center justify-center rounded-xl text-muted hover:text-ink'
</script>

<template>
  <div class="relative">
    <input
      v-bind="$attrs"
      v-model="model"
      type="number"
      step="0.1"
      inputmode="decimal"
      class="field pr-24"
    />
    <div class="absolute inset-y-0 right-0 flex">
      <button type="button" :class="step" aria-label="1 kg less" @click="stepDown">
        <IconMinus />
      </button>
      <button type="button" :class="step" aria-label="1 kg more" @click="stepUp">
        <IconPlus />
      </button>
    </div>
  </div>
</template>
