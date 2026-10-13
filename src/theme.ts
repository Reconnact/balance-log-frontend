import { ref, watch } from 'vue'

export type Theme = 'system' | 'light' | 'dark'

const order: Theme[] = ['system', 'light', 'dark']

export const theme = ref<Theme>((localStorage.getItem('theme') as Theme | null) ?? 'system')

watch(
  theme,
  (value) => {
    if (value === 'system') {
      localStorage.removeItem('theme')
      delete document.documentElement.dataset.theme
    } else {
      localStorage.setItem('theme', value)
      document.documentElement.dataset.theme = value
    }
  },
  { immediate: true },
)

export function cycleTheme() {
  theme.value = order[(order.indexOf(theme.value) + 1) % order.length]!
}
