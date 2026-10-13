import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import WeightList from '../WeightList.vue'

const entry = {
  id: '3f2b8c1e-6d4a-4f7e-9b2a-1c5d8e0f4a71',
  measuredAt: '2026-10-01T06:30:00Z',
  weightKg: 82.4,
}

describe('WeightList', () => {
  it('renders a row per entry with weight and time', () => {
    const wrapper = mount(WeightList, {
      props: {
        entries: [
          entry,
          {
            id: 'e076581b-33dc-462a-bbf1-865500cd1667',
            measuredAt: '2026-10-08T06:20:00Z',
            weightKg: 82,
          },
        ],
      },
    })

    const rows = wrapper.findAll('li')
    expect(rows).toHaveLength(2)
    expect(rows[0]!.text()).toContain('82.4 kg')
    expect(rows[0]!.text()).toMatch(/1 Oct 2026, \d\d:\d\d/)
    expect(rows[1]!.text()).toContain('82.0 kg')
    expect(wrapper.text()).not.toContain('No weights yet.')
  })

  it('shows the empty state without entries', () => {
    const wrapper = mount(WeightList, { props: { entries: [] } })

    expect(wrapper.find('li').exists()).toBe(false)
    expect(wrapper.text()).toBe('No weights yet. Log one to start the curve.')
  })

  it('names the entry in its icon buttons', () => {
    const wrapper = mount(WeightList, { props: { entries: [entry] } })

    expect(wrapper.findAll('li button').map((b) => b.attributes('aria-label'))).toEqual([
      'Edit 82.4 kg, 1 Oct 2026',
      'Delete 82.4 kg, 1 Oct 2026',
    ])
  })

  it('emits edit with the entry of its row', async () => {
    const wrapper = mount(WeightList, { props: { entries: [entry] } })

    await wrapper.find('li button[aria-label^="Edit"]').trigger('click')

    expect(wrapper.emitted('edit')).toEqual([[entry]])
  })

  it('emits delete with the entry of its row', async () => {
    const wrapper = mount(WeightList, { props: { entries: [entry] } })

    await wrapper.find('li button[aria-label^="Delete"]').trigger('click')

    expect(wrapper.emitted('delete')).toEqual([[entry]])
  })
})
