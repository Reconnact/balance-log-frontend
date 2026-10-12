import axios from 'axios'
import { token } from '@/auth'
import router from '@/router'

const client = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL })

client.interceptors.request.use((config) => {
  if (token.value) config.headers.Authorization = `Bearer ${token.value}`
  return config
})

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      token.value = null
      router.push('/login')
    }
    return Promise.reject(error)
  },
)

export default client
