import { ref, watch } from 'vue'

export const token = ref<string | null>(localStorage.getItem('token'))

watch(token, (value) => {
  if (value) localStorage.setItem('token', value)
  else localStorage.removeItem('token')
})
