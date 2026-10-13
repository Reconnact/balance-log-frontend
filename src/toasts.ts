import { ref } from 'vue'

export interface Toast {
  id: number
  text: string
  kind: 'success' | 'error'
}

export const toasts = ref<Toast[]>([])

let nextId = 0

export function showToast(text: string, kind: Toast['kind'] = 'success') {
  const id = nextId++
  toasts.value.push({ id, text, kind })
  setTimeout(() => {
    toasts.value = toasts.value.filter((toast) => toast.id !== id)
  }, 4000)
}
