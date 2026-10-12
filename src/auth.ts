import { computed, ref, watch } from 'vue'
import * as api from '@/api/auth'

export const token = ref<string | null>(localStorage.getItem('token'))

watch(token, (value) => {
  if (value) localStorage.setItem('token', value)
  else localStorage.removeItem('token')
})

export const isLoggedIn = computed(() => token.value !== null)

export async function login(email: string, password: string) {
  token.value = (await api.login(email, password)).token
}

export async function register(email: string, password: string) {
  await api.register(email, password)
}

export function logout() {
  token.value = null
}
