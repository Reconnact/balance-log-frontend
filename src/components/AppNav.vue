<script setup lang="ts">
import { ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import IconMenu from './icons/IconMenu.vue'
import ThemeToggle from './ThemeToggle.vue'
import { isLoggedIn, logout } from '@/auth'

const route = useRoute()
const router = useRouter()
const menuOpen = ref(false)

watch(
  () => route.fullPath,
  () => (menuOpen.value = false),
)

function onLogout() {
  logout()
  router.push('/login')
}

const item =
  'inline-flex min-h-11 items-center gap-2 rounded-xl border-0 bg-transparent px-3 text-base font-medium text-muted no-underline hover:text-ink [&.router-link-active]:text-ink'
const row =
  'flex min-h-11 w-full items-center gap-3 border-x-0 border-t-0 border-b border-line bg-transparent px-0 text-base last:border-b-0 font-medium text-ink no-underline'
</script>

<template>
  <header class="glass sticky top-0 z-20 border-b border-line bg-surface-strong">
    <nav class="mx-auto flex h-14 max-w-content items-center px-4">
      <RouterLink to="/" class="mr-auto text-[17px] font-semibold text-ink no-underline">
        Balance Log
      </RouterLink>
      <template v-if="isLoggedIn">
        <div class="hidden items-center sm:flex">
          <RouterLink to="/weights" :class="item">Weights</RouterLink>
          <RouterLink to="/goal" :class="item">Goal</RouterLink>
          <ThemeToggle :class="item" />
          <button type="button" :class="item" @click="onLogout">Log out</button>
        </div>
        <button
          type="button"
          class="-mr-3 inline-flex size-11 items-center justify-center rounded-xl border-0 bg-transparent text-ink sm:hidden"
          aria-label="Menu"
          aria-controls="nav-menu"
          :aria-expanded="menuOpen"
          @click="menuOpen = !menuOpen"
        >
          <IconMenu />
        </button>
      </template>
      <ThemeToggle v-else :class="item" class="-mr-3" />
    </nav>
    <div
      v-if="isLoggedIn"
      v-show="menuOpen"
      id="nav-menu"
      class="mx-auto max-w-content border-t border-line px-4 pb-2 sm:hidden"
    >
      <RouterLink to="/weights" :class="row">Weights</RouterLink>
      <RouterLink to="/goal" :class="row">Goal</RouterLink>
      <ThemeToggle :class="row" />
      <button type="button" :class="row" @click="onLogout">Log out</button>
    </div>
  </header>
</template>
