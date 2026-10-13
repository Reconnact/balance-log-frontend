import { afterEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import ColdStartBanner from '../ColdStartBanner.vue'
import { slowRequests } from '@/api/client'

describe('ColdStartBanner', () => {
  afterEach(() => {
    slowRequests.value = 0
  })

  it('stays hidden while requests are fast', () => {
    const wrapper = mount(ColdStartBanner)

    expect(wrapper.text()).toBe('')
  })

  it('explains the wait while a request is slow', async () => {
    const wrapper = mount(ColdStartBanner)

    slowRequests.value = 1
    await wrapper.vm.$nextTick()

    expect(wrapper.find('[role="status"]').text()).toBe(
      'Starting the server. On the free plan this takes up to 90 seconds.',
    )
  })
})
