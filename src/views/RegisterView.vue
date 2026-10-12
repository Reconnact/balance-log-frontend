<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { isAxiosError } from 'axios'
import { register } from '@/auth'

const router = useRouter()

const email = ref('')
const password = ref('')
const errors = ref<Record<string, string>>({})

async function submit() {
  errors.value = {}
  try {
    await register(email.value, password.value)
    await router.push('/login')
  } catch (error) {
    if (!isAxiosError(error)) throw error
    if (error.response?.status === 400) errors.value = error.response.data.errors
    else if (error.response?.status === 409) errors.value = { email: error.response.data.detail }
    else throw error
  }
}
</script>

<template>
  <div class="row justify-content-center">
    <div class="col-sm-8 col-md-6 col-lg-4">
      <h1 class="h3 mb-4">Register</h1>
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
            autocomplete="new-password"
            class="form-control"
            :class="{ 'is-invalid': errors.password }"
          />
          <div class="invalid-feedback">{{ errors.password }}</div>
        </div>
        <button type="submit" class="btn btn-dark w-100">Register</button>
      </form>
      <p class="mt-3">Already registered? <RouterLink to="/login">Log in</RouterLink></p>
    </div>
  </div>
</template>
