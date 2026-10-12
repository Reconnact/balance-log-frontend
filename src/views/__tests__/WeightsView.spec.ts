import { describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import WeightsView from '../WeightsView.vue'
import WeightChart from '@/components/WeightChart.vue'
import { listWeightEntries } from '@/api/weights'

vi.mock('@/api/weights')

const entries = [
  {
    id: '3f2b8c1e-6d4a-4f7e-9b2a-1c5d8e0f4a71',
    measuredAt: '2026-10-01T06:30:00Z',
    weightKg: 82.4,
  },
  {
    id: 'a9e47d20-1b6c-4c3f-8e5d-7f2a9b0c6d13',
    measuredAt: '2026-10-03T06:45:00Z',
    weightKg: 82.1,
  },
]

describe('WeightsView', () => {
  it('shows the entries from the API in the list and the chart', async () => {
    vi.mocked(listWeightEntries).mockResolvedValue(entries)

    const wrapper = mount(WeightsView, { global: { stubs: { WeightChart: true } } })
    await flushPromises()

    const rows = wrapper.findAll('tbody tr')
    expect(rows).toHaveLength(2)
    expect(rows[0]!.text()).toContain('82.4 kg')
    expect(rows[1]!.text()).toContain('82.1 kg')
    expect(wrapper.findComponent(WeightChart).props('entries')).toEqual(entries)
  })
})
