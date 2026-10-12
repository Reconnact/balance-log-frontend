<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { isAxiosError } from 'axios'
import { login } from '@/auth'

const route = useRoute()
const router = useRouter()

const email = ref('')
const password = ref('')
const errors = ref<Record<string, string>>({})
const message = ref('')

async function submit() {
  errors.value = {}
  message.value = ''
  try {
    await login(email.value, password.value)
    await router.push(typeof route.query.redirect === 'string' ? route.query.redirect : '/weights')
  } catch (error) {
    if (!isAxiosError(error)) throw error
    if (error.response?.status === 400) errors.value = error.response.data.errors
    else if (error.response?.status === 401) message.value = error.response.data.detail
    else throw error
  }
}
</script>

<template>
  <div class="row justify-content-center">
    <div class="col-sm-8 col-md-6 col-lg-4">
      <h1 class="h3 mb-4">Log in</h1>
      <form novalidate @submit.prevent="submit">
        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            autocomplete="email"
            class="form-control"
            :class="{ 'is-invalid': errors.email }"
          />
          <div class="invalid-feedback">{{ errors.email }}</div>
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            autocomplete="current-password"
            class="form-control"
            :class="{ 'is-invalid': errors.password }"
          />
          <div class="invalid-feedback">{{ errors.password }}</div>
        </div>
        <p v-if="message" class="text-danger">{{ message }}</p>
        <button type="submit" class="btn btn-dark w-100">Log in</button>
      </form>
      <p class="mt-3">No account yet? <RouterLink to="/register">Register</RouterLink></p>
    </div>
  </div>
</template>
