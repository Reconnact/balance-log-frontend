<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router'
import { isLoggedIn, logout } from '@/auth'

const router = useRouter()

function onLogout() {
  logout()
  router.push('/login')
}
</script>

<template>
  <nav class="navbar navbar-expand border-bottom mb-4">
    <div class="container">
      <RouterLink to="/" class="navbar-brand">Balance Log</RouterLink>
      <ul class="navbar-nav ms-auto">
        <template v-if="isLoggedIn">
          <li class="nav-item">
            <RouterLink to="/weights" class="nav-link">Weights</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/goal" class="nav-link">Goal</RouterLink>
          </li>
          <li class="nav-item">
            <button type="button" class="nav-link" @click="onLogout">Log out</button>
          </li>
        </template>
        <template v-else>
          <li class="nav-item">
            <RouterLink to="/login" class="nav-link">Log in</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/register" class="nav-link">Register</RouterLink>
          </li>
        </template>
      </ul>
    </div>
  </nav>
</template>
