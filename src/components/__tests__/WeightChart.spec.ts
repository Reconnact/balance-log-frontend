import { describe, expect, it } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { Line } from 'vue-chartjs'
import WeightChart from '../WeightChart.vue'

describe('WeightChart', () => {
  const wrapper = shallowMount(WeightChart, {
    props: {
      entries: [
        {
          id: '3f2b8c1e-6d4a-4f7e-9b2a-1c5d8e0f4a71',
          measuredAt: '2026-10-01T06:30:00Z',
          weightKg: 82.4,
        },
        {
          id: '00e94b85-63c4-4b65-ac03-3552ca86ec7c',
          measuredAt: '2026-10-10T06:55:00Z',
          weightKg: 81.6,
        },
      ],
    },
  })
  const line = wrapper.findComponent(Line)

  it('plots each entry at its time in epoch ms', () => {
    expect(line.props('data').datasets[0]!.data).toEqual([
      { x: 1790836200000, y: 82.4 },
      { x: 1791615300000, y: 81.6 },
    ])
  })

  it('uses a linear x axis labelled with dates', () => {
    const x = line.props('options')!.scales!.x as {
      type: string
      ticks: { callback: (value: number) => string }
    }

    expect(x.type).toBe('linear')
    expect(x.ticks.callback(Date.parse('2026-10-01T12:00:00Z'))).toBe('1 Oct')
  })

  it('draws no goal line without a goal', () => {
    expect(line.props('data').datasets).toHaveLength(1)
  })

  it('draws the goal as a flat line across the entries', async () => {
    await wrapper.setProps({ targetKg: 75 })

    expect(wrapper.findComponent(Line).props('data').datasets[1]!.data).toEqual([
      { x: 1790836200000, y: 75 },
      { x: 1791615300000, y: 75 },
    ])
  })
})
