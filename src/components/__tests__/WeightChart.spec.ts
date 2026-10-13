import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, shallowMount, type VueWrapper } from '@vue/test-utils'
import { Line } from 'vue-chartjs'
import type { ChartOptions, TooltipItem } from 'chart.js'
import WeightChart from '../WeightChart.vue'
import { theme } from '@/theme'

const entries = [
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
]

const DAY = 86_400_000

let media: Record<string, boolean>

function line(wrapper: VueWrapper) {
  return wrapper.findComponent(Line)
}

function options(wrapper: VueWrapper) {
  return line(wrapper).props('options') as ChartOptions<'line'>
}

function xTicks(wrapper: VueWrapper) {
  return (options(wrapper).scales!.x as { ticks: Record<string, unknown> }).ticks as {
    maxTicksLimit: number
    callback: (this: { min: number; max: number }, value: number) => string
  }
}

describe('WeightChart', () => {
  beforeEach(() => {
    media = {}
    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: media[query] ?? false,
      addEventListener: () => {},
      removeEventListener: () => {},
    }))
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    theme.value = 'system'
    document.documentElement.style.removeProperty('--color-accent')
  })

  it('plots each entry at its time in epoch ms', () => {
    const wrapper = shallowMount(WeightChart, { props: { entries } })

    expect(line(wrapper).props('data').datasets[0]!.data).toEqual([
      { x: 1790836200000, y: 82.4 },
      { x: 1791615300000, y: 81.6 },
    ])
  })

  it('draws a 2 px straight line without points, filled below', () => {
    const wrapper = shallowMount(WeightChart, { props: { entries } })

    expect(line(wrapper).props('data').datasets[0]).toMatchObject({
      borderWidth: 2,
      tension: 0,
      pointRadius: 0,
      fill: 'start',
    })
  })

  it('draws no goal line without a goal', () => {
    const wrapper = shallowMount(WeightChart, { props: { entries } })

    expect(line(wrapper).props('data').datasets).toHaveLength(1)
  })

  it('draws the goal as a flat 1.5 px dash across the entries', () => {
    const wrapper = shallowMount(WeightChart, { props: { entries, targetKg: 75 } })

    expect(line(wrapper).props('data').datasets[1]).toMatchObject({
      data: [
        { x: 1790836200000, y: 75 },
        { x: 1791615300000, y: 75 },
      ],
      borderWidth: 1.5,
      borderDash: [6, 6],
    })
  })

  it('labels x ticks by day up to a year and by month beyond', () => {
    const wrapper = shallowMount(WeightChart, { props: { entries } })
    const callback = xTicks(wrapper).callback
    const value = Date.parse('2026-10-01T12:00:00Z')

    expect(callback.call({ min: value - 365 * DAY, max: value }, value)).toBe('1 Oct')
    expect(callback.call({ min: value - 366 * DAY, max: value }, value)).toBe('Oct 2026')
  })

  it('ends the x axis at the first and last entry', () => {
    const wrapper = shallowMount(WeightChart, { props: { entries } })

    expect((options(wrapper).scales!.x as { bounds: string }).bounds).toBe('data')
  })

  it('shows at most 4 x ticks on a phone and 7 from 576 px', () => {
    expect(xTicks(shallowMount(WeightChart, { props: { entries } })).maxTicksLimit).toBe(4)

    media['(min-width: 36rem)'] = true

    expect(xTicks(shallowMount(WeightChart, { props: { entries } })).maxTicksLimit).toBe(7)
  })

  it('leaves 0.5 kg of room above and below', () => {
    const wrapper = shallowMount(WeightChart, { props: { entries } })

    expect((options(wrapper).scales!.y as { grace: number }).grace).toBe(0.5)
  })

  it('shows date and weight of the weight line in the tooltip', () => {
    const wrapper = shallowMount(WeightChart, { props: { entries, targetKg: 75 } })
    const tooltip = options(wrapper).plugins!.tooltip!
    const item = { datasetIndex: 0, parsed: { x: 1790836200000, y: 82.4 } } as TooltipItem<'line'>

    expect(tooltip.filter!.call(tooltip as never, item, 0, [], {} as never)).toBe(true)
    expect(
      tooltip.filter!.call(tooltip as never, { ...item, datasetIndex: 1 }, 0, [], {} as never),
    ).toBe(false)
    expect((tooltip.callbacks!.title as (items: TooltipItem<'line'>[]) => string)([item])).toMatch(
      /^1 Oct 2026, \d\d:\d\d$/,
    )
    expect((tooltip.callbacks!.label as (item: TooltipItem<'line'>) => string)(item)).toBe(
      '82.4 kg',
    )
  })

  it('animates for 300 ms', () => {
    const wrapper = shallowMount(WeightChart, { props: { entries } })

    expect(options(wrapper).animation).toMatchObject({ duration: 300 })
  })

  it('does not animate under reduced motion', () => {
    media['(prefers-reduced-motion: reduce)'] = true

    const wrapper = shallowMount(WeightChart, { props: { entries } })

    expect(options(wrapper).animation).toBe(false)
  })

  it('takes its colours from the tokens again after a theme change', async () => {
    document.documentElement.style.setProperty('--color-accent', '#3d5a75')
    const wrapper = shallowMount(WeightChart, { props: { entries } })
    expect(line(wrapper).props('data').datasets[0]!.borderColor).toBe('#3d5a75')

    document.documentElement.style.setProperty('--color-accent', '#93b4d1')
    theme.value = 'dark'
    await flushPromises()

    expect(line(wrapper).props('data').datasets[0]!.borderColor).toBe('#93b4d1')
  })
})
