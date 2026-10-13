import { afterEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import AppToasts from '../AppToasts.vue'
import { showToast, toasts } from '@/toasts'

describe('AppToasts', () => {
  afterEach(() => {
    toasts.value = []
  })

  it('shows each toast in a live region', async () => {
    const wrapper = mount(AppToasts)

    showToast('Entry saved')
    showToast('No connection to the server. Check your connection and try again.', 'error')
    await wrapper.vm.$nextTick()

    expect(wrapper.attributes('aria-live')).toBe('polite')
    expect(wrapper.findAll('li').map((li) => li.text())).toEqual([
      'Entry saved',
      'No connection to the server. Check your connection and try again.',
    ])
  })
})
