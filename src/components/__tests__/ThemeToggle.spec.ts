import { afterEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import ThemeToggle from '../ThemeToggle.vue'
import { theme } from '@/theme'

describe('ThemeToggle', () => {
  afterEach(() => {
    theme.value = 'system'
  })

  it('shows the current theme', () => {
    const wrapper = mount(ThemeToggle)

    expect(wrapper.text()).toBe('System')
    expect(wrapper.attributes('aria-label')).toBe('Theme: System')
  })

  it('cycles the theme on click', async () => {
    const wrapper = mount(ThemeToggle)

    await wrapper.trigger('click')

    expect(theme.value).toBe('light')
    expect(wrapper.text()).toBe('Light')
  })
})
