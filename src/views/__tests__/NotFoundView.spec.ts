import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import NotFoundView from '../NotFoundView.vue'
import router from '@/router'

describe('NotFoundView', () => {
  it('links back to the weights', () => {
    const wrapper = mount(NotFoundView, { global: { plugins: [router] } })

    expect(wrapper.find('h1').text()).toBe('404')
    expect(wrapper.find('a').attributes('href')).toBe('/weights')
  })
})
