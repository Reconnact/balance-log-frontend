<script setup lang="ts">
import { ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import IconClose from './icons/IconClose.vue'
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

watch(menuOpen, (open) => document.documentElement.classList.toggle('max-sm:overflow-hidden', open))

function onLogout() {
  logout()
  router.push('/login')
}

const item =
  'inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-base font-medium text-muted hover:text-ink [&.router-link-active]:text-ink'
const row = 'flex min-h-14 w-full items-center gap-3 text-2xl font-medium text-ink'
</script>

<template>
  <header class="glass sticky top-0 z-20 border-b border-line bg-surface-strong">
    <nav class="mx-auto flex h-14 max-w-content items-center px-4">
      <RouterLink to="/" class="mr-auto text-[17px] font-semibold text-ink">
        Balance Log
      </RouterLink>
      <template v-if="isLoggedIn">
        <div class="hidden items-center sm:flex">
          <RouterLink to="/weights" :class="item">Weights</RouterLink>
          <RouterLink to="/goal" :class="item">Goal</RouterLink>
          <ThemeToggle :class="item" />
          <button type="button" :class="item" class="text-danger!" @click="onLogout">
            Log out
          </button>
        </div>
        <button
          type="button"
          class="-mr-3 inline-flex size-11 items-center justify-center rounded-xl text-ink sm:hidden"
          aria-label="Menu"
          aria-controls="nav-menu"
          :aria-expanded="menuOpen"
          @click="menuOpen = !menuOpen"
        >
          <IconClose v-if="menuOpen" />
          <IconMenu v-else />
        </button>
      </template>
      <ThemeToggle v-else :class="item" class="-mr-3" />
    </nav>
  </header>
  <Transition
    enter-active-class="transition-opacity duration-100"
    leave-active-class="transition-opacity duration-100"
    enter-from-class="opacity-0"
    leave-to-class="opacity-0"
  >
    <div
      v-if="isLoggedIn"
      v-show="menuOpen"
      id="nav-menu"
      class="fixed inset-0 z-10 bg-bg pt-14 sm:hidden"
    >
      <div class="mx-auto max-w-content px-4 py-4">
        <RouterLink to="/weights" :class="row">Weights</RouterLink>
        <RouterLink to="/goal" :class="row">Goal</RouterLink>
        <ThemeToggle :class="row" />
        <button type="button" :class="row" class="text-danger!" @click="onLogout">Log out</button>
      </div>
    </div>
  </Transition>
</template>
