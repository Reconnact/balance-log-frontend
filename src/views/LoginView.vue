<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { isAxiosError } from 'axios'
import PasswordInput from '@/components/PasswordInput.vue'
import IconBrand from '@/components/icons/IconBrand.vue'
import { login } from '@/auth'

const route = useRoute()
const router = useRouter()

const email = ref('')
const password = ref('')
const errors = ref<Record<string, string>>({})
const message = ref('')
const saving = ref(false)

async function submit() {
  errors.value = {}
  message.value = ''
  saving.value = true
  try {
    await login(email.value, password.value)
    await router.push(typeof route.query.redirect === 'string' ? route.query.redirect : '/weights')
  } catch (error) {
    if (!isAxiosError(error)) throw error
    if (error.response?.status === 400) errors.value = error.response.data.errors
    else if (error.response?.status === 401) message.value = error.response.data.detail
    else throw error
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="mx-auto max-w-sm pt-4 sm:pt-10">
    <IconBrand class="mx-auto mb-6 block" />
    <div class="panel glass p-5 sm:p-6">
      <h1 class="mb-5 text-title font-bold sm:text-3xl">Log in</h1>
      <p v-if="route.query.expired" class="mb-5 text-ink">Your session expired. Log in again.</p>
      <form novalidate class="flex flex-col gap-4" @submit.prevent="submit">
        <div>
          <label for="email" class="mb-1.5 block text-label font-medium text-muted">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            autocomplete="email"
            class="field"
            :aria-invalid="!!errors.email"
            :aria-describedby="errors.email ? 'email-error' : undefined"
          />
          <p v-if="errors.email" id="email-error" class="mt-1.5 text-label text-danger">
            {{ errors.email }}
          </p>
        </div>
        <div>
          <label for="password" class="mb-1.5 block text-label font-medium text-muted">
            Password
          </label>
          <PasswordInput
            id="password"
            v-model="password"
            autocomplete="current-password"
            :aria-invalid="!!errors.password"
            :aria-describedby="errors.password ? 'password-error' : undefined"
          />
          <p v-if="errors.password" id="password-error" class="mt-1.5 text-label text-danger">
            {{ errors.password }}
          </p>
        </div>
        <p v-if="message" class="text-danger">{{ message }}</p>
        <button
          type="submit"
          class="btn btn-primary mt-1 w-full"
          :disabled="saving"
          :aria-busy="saving"
        >
          Log in
        </button>
      </form>
    </div>
    <p class="mt-5 text-center text-muted">
      No account yet?
      <RouterLink to="/register" class="font-medium text-accent">Register</RouterLink>
    </p>
  </div>
</template>
