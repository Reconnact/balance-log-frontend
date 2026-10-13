<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppNav from '@/components/AppNav.vue'
</script>

<template>
  <AppNav />
  <main class="mx-auto max-w-content px-4 py-6">
    <RouterView />
  </main>
</template>
