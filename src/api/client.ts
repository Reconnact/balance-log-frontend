import axios from 'axios'
import { token } from '@/auth'
import router from '@/router'
import { showToast } from '@/toasts'

const client = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL, timeout: 120_000 })

client.interceptors.request.use((config) => {
  if (token.value) config.headers.Authorization = `Bearer ${token.value}`
  return config
})

client.interceptors.response.use(
  (response) => response,
  (error) => {
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
