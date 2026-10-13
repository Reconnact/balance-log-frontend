<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { isAxiosError } from 'axios'
import GoalForm from '@/components/GoalForm.vue'
import GoalProgress from '@/components/GoalProgress.vue'
import { getGoal, getProgress } from '@/api/goal'
import { showToast } from '@/toasts'
import type { Goal, Progress } from '@/types'

const goal = ref<Goal | null>(null)
const progress = ref<Progress | null>(null)
const state = ref<'loading' | 'loaded' | 'failed'>('loading')

async function load() {
  try {
    ;[goal.value, progress.value] = await Promise.all([getGoal(), getProgress()])
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

async function saved(saved: Goal) {
  showToast('Goal set')
  goal.value = saved
  progress.value = await getProgress()
}

onMounted(load)
</script>

<template>
  <h1 class="mb-5 text-title font-bold sm:text-3xl">Goal</h1>
  <section :aria-busy="state === 'loading'" class="flex flex-col gap-5">
    <template v-if="state === 'loading'">
      <div class="panel h-[76px] animate-pulse motion-reduce:animate-none" aria-hidden="true"></div>
      <div class="panel h-56 animate-pulse motion-reduce:animate-none" aria-hidden="true"></div>
    </template>
    <div v-else-if="state === 'failed'" class="panel px-4 py-6 text-center">
      <p class="mb-4 text-muted">Not loaded.</p>
      <button type="button" class="btn" @click="retry">Try again</button>
    </div>
    <!-- the form takes the goal only when it mounts -->
    <template v-else>
      <GoalForm :target-kg="goal?.targetKg" @saved="saved" />
      <GoalProgress v-if="progress" :progress="progress" />
      <p v-else class="panel m-0 px-4 py-6 text-center text-muted">
        {{ goal ? 'Log a weight to see your progress.' : 'Set a goal to see your progress.' }}
      </p>
    </template>
  </section>
</template>
