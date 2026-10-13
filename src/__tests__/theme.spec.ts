import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'

async function loadTheme() {
  vi.resetModules()
  return import('@/theme')
}

describe('theme', () => {
  afterEach(() => {
    localStorage.clear()
    delete document.documentElement.dataset.theme
  })

  it('follows the system without a saved choice', async () => {
    const { theme } = await loadTheme()
    await nextTick()

    expect(theme.value).toBe('system')
    expect(document.documentElement.dataset.theme).toBeUndefined()
  })

  it('starts from the saved choice', async () => {
    localStorage.setItem('theme', 'dark')

    const { theme } = await loadTheme()
    await nextTick()

    expect(theme.value).toBe('dark')
    expect(document.documentElement.dataset.theme).toBe('dark')
  })

  it('cycles system, light, dark and back', async () => {
    const { theme, cycleTheme } = await loadTheme()
    const seen = []
    for (let i = 0; i < 3; i++) {
      cycleTheme()
      seen.push(theme.value)
    }

    expect(seen).toEqual(['light', 'dark', 'system'])
  })

  it('keeps the choice and sets it on the root element', async () => {
    const { cycleTheme } = await loadTheme()

    cycleTheme()
    await nextTick()

    expect(localStorage.getItem('theme')).toBe('light')
    expect(document.documentElement.dataset.theme).toBe('light')
  })

  it('forgets the choice and clears the root element back on system', async () => {
    localStorage.setItem('theme', 'dark')
    const { cycleTheme } = await loadTheme()
    await nextTick()

    cycleTheme()
    await nextTick()

    expect(localStorage.getItem('theme')).toBeNull()
    expect(document.documentElement.dataset.theme).toBeUndefined()
  })
})
