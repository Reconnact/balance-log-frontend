import { ref } from 'vue'

export interface Toast {
  id: number
  text: string
  kind: 'success' | 'error'
}

export const toasts = ref<Toast[]>([])

let nextId = 0

export function showToast(text: string, kind: Toast['kind'] = 'success') {
  if (toasts.value.some((toast) => toast.text === text)) return
  const id = nextId++
  toasts.value.push({ id, text, kind })
  setTimeout(() => dismissToast(id), 4000)
}

export function dismissToast(id: number) {
  toasts.value = toasts.value.filter((toast) => toast.id !== id)
}
