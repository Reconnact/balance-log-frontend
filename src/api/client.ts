import { ref } from 'vue'
import axios from 'axios'
import { token } from '@/auth'
import router from '@/router'
import { showToast } from '@/toasts'

const client = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL, timeout: 120_000 })

export const slowRequests = ref(0)

const ends = new WeakMap<object, () => void>()

function end(config?: object) {
  if (!config) return
  ends.get(config)?.()
  ends.delete(config)
}

client.interceptors.request.use((config) => {
  if (token.value) config.headers.Authorization = `Bearer ${token.value}`
  let slow = false
  const timer = setTimeout(() => {
    slow = true
    slowRequests.value++
  }, 5000)
  ends.set(config, () => {
    clearTimeout(timer)
    if (slow) slowRequests.value--
  })
  return config
})

client.interceptors.response.use(
  (response) => {
    end(response.config)
    return response
  },
  (error) => {
    end(error.config)
    const status = error.response?.status
    if (status === undefined) {
      showToast('No connection to the server. Check your connection and try again.', 'error')
    } else if (status >= 500) {
      showToast('The server had a problem. Try again in a moment.', 'error')
    } else if (status === 401 && token.value) {
      token.value = null
      router.push({
        path: '/login',
        query: { redirect: router.currentRoute.value.fullPath, expired: '1' },
      })
    }
    return Promise.reject(error)
  },
)

export default client
