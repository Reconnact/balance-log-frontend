<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <h1 class="mb-5 text-title font-bold sm:text-3xl">Page not found</h1>
  <div class="panel px-4 py-6 text-center">
    <p class="mb-4 text-muted">This page doesn't exist.</p>
    <RouterLink to="/weights" class="btn btn-primary">Go to weights</RouterLink>
  </div>
</template>
