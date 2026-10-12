import { describe, expect, it } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import WeightList from '../WeightList.vue'

const entry = {
  id: '3f2b8c1e-6d4a-4f7e-9b2a-1c5d8e0f4a71',
  measuredAt: '2026-10-01T06:30:00Z',
  weightKg: 82.4,
}

function button(wrapper: VueWrapper, text: string) {
  return wrapper.findAll('tbody tr button').find((b) => b.text() === text)!
}

describe('WeightList', () => {
  it('renders a row per entry', () => {
    const wrapper = mount(WeightList, {
      props: {
        entries: [
          {
            id: '3f2b8c1e-6d4a-4f7e-9b2a-1c5d8e0f4a71',
            measuredAt: '2026-10-01T06:30:00Z',
            weightKg: 82.4,
          },
          {
            id: 'e076581b-33dc-462a-bbf1-865500cd1667',
            measuredAt: '2026-10-08T06:20:00Z',
            weightKg: 82,
          },
        ],
      },
    })

    const rows = wrapper.findAll('tbody tr')
    expect(rows).toHaveLength(2)
    expect(rows[0]!.text()).toContain('82.4 kg')
    expect(rows[1]!.text()).toContain('82.0 kg')
    expect(wrapper.text()).not.toContain('No entries yet.')
  })

  it('shows the empty state without entries', () => {
    const wrapper = mount(WeightList, { props: { entries: [] } })

    expect(wrapper.find('table').exists()).toBe(false)
    expect(wrapper.text()).toContain('No entries yet.')
  })

  it('emits edit with the entry of its row', async () => {
    const wrapper = mount(WeightList, { props: { entries: [entry] } })

    await button(wrapper, 'Edit').trigger('click')

    expect(wrapper.emitted('edit')).toEqual([[entry]])
  })

  it('emits delete with the entry of its row', async () => {
    const wrapper = mount(WeightList, { props: { entries: [entry] } })

    await button(wrapper, 'Delete').trigger('click')

    expect(wrapper.emitted('delete')).toEqual([[entry]])
  })
})
