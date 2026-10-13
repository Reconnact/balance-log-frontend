<script setup lang="ts">
import { onMounted, ref } from 'vue'
import GoalForm from '@/components/GoalForm.vue'
import GoalProgress from '@/components/GoalProgress.vue'
import { getGoal, getProgress } from '@/api/goal'
import type { Goal, Progress } from '@/types'

const goal = ref<Goal | null>(null)
const progress = ref<Progress | null>(null)
const loaded = ref(false)

async function saved(saved: Goal) {
  goal.value = saved
  progress.value = await getProgress()
}

onMounted(async () => {
  ;[goal.value, progress.value] = await Promise.all([getGoal(), getProgress()])
  loaded.value = true
})
</script>

<template>
  <h1 class="h3 mb-4">Goal</h1>
  <!-- the form takes the goal only when it mounts -->
  <template v-if="loaded">
    <div class="mb-4">
      <GoalForm :target-kg="goal?.targetKg" @saved="saved" />
    </div>
    <GoalProgress v-if="progress" :progress="progress" />
    <p v-else-if="goal" class="text-body-secondary">Log a weight to see your progress.</p>
    <p v-else class="text-body-secondary">Set a goal to see your progress.</p>
  </template>
</template>
