import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import { AxiosError, AxiosHeaders } from 'axios'
import WeightsView from '../WeightsView.vue'
import WeightChart from '@/components/WeightChart.vue'
import {
  createWeightEntry,
  deleteWeightEntry,
  listWeightEntries,
  updateWeightEntry,
} from '@/api/weights'
import { getGoal } from '@/api/goal'

vi.mock('@/api/weights')
vi.mock('@/api/goal')

// jsdom has no modal dialog
HTMLDialogElement.prototype.showModal = function () {
  this.open = true
}
HTMLDialogElement.prototype.close = function () {
  this.open = false
  this.dispatchEvent(new Event('close'))
}

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

function failedWith(status: number, data: unknown) {
  const config = { headers: new AxiosHeaders() }
  return new AxiosError('Request failed', undefined, config, undefined, {
    status,
    statusText: '',
    headers: {},
    config,
    data,
  })
}

async function mountView() {
  const wrapper = mount(WeightsView, { global: { stubs: { WeightChart: true } } })
  await flushPromises()
  return wrapper
}

function button(wrapper: VueWrapper, text: string) {
  return wrapper.findAll('button').find((b) => b.text() === text)!
}

function rowButton(wrapper: VueWrapper, row: number, text: string) {
  return wrapper
    .findAll('tbody tr')
    [row]!.findAll('button')
    .find((b) => b.text() === text)!
}

describe('WeightsView', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(listWeightEntries).mockResolvedValue(entries)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('shows the entries from the API in the list and the chart', async () => {
    const wrapper = await mountView()

    const rows = wrapper.findAll('tbody tr')
    expect(rows).toHaveLength(2)
    expect(rows[0]!.text()).toContain('82.4 kg')
    expect(rows[1]!.text()).toContain('82.1 kg')
    expect(wrapper.findComponent(WeightChart).props('entries')).toEqual(entries)
  })

  it('passes the goal to the chart', async () => {
    vi.mocked(getGoal).mockResolvedValue({ targetKg: 75 })

    const wrapper = await mountView()

    expect(wrapper.findComponent(WeightChart).props('targetKg')).toBe(75)
  })

  it('loads all entries first and reloads from the start of a chosen period', async () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date('2026-10-12T10:00:00Z'))
    const wrapper = await mountView()

    await wrapper.find('#period-week').setValue(true)
    await flushPromises()

    expect(listWeightEntries).toHaveBeenNthCalledWith(1, undefined)
    expect(listWeightEntries).toHaveBeenNthCalledWith(2, '2026-10-05T10:00:00.000Z')
  })

  it('logs an entry in a dialog and reloads the list', async () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date('2026-10-12T10:00:30Z'))
    vi.mocked(createWeightEntry).mockResolvedValue(entries[0]!)
    const wrapper = await mountView()

    expect(wrapper.find('dialog form').exists()).toBe(false)
    await button(wrapper, 'Log weight').trigger('click')
    expect(wrapper.find<HTMLDialogElement>('dialog').element.open).toBe(true)
    expect(wrapper.find<HTMLInputElement>('dialog #weightKg').element.value).toBe('')

    await wrapper.find('dialog #weightKg').setValue('82.4')
    await wrapper.find('dialog form').trigger('submit')
    await flushPromises()

    expect(createWeightEntry).toHaveBeenCalledWith({
      measuredAt: '2026-10-12T10:00:00.000Z',
      weightKg: 82.4,
    })
    expect(listWeightEntries).toHaveBeenCalledTimes(2)
    expect(wrapper.find<HTMLDialogElement>('dialog').element.open).toBe(false)
  })

  it('fills the dialog before it opens, so the browser focuses the weight field', async () => {
    let hadForm = false
    const showModal = vi
      .spyOn(HTMLDialogElement.prototype, 'showModal')
      .mockImplementation(function (this: HTMLDialogElement) {
        hadForm = this.querySelector('#weightKg') !== null
        this.open = true
      })
    const wrapper = await mountView()

    await button(wrapper, 'Log weight').trigger('click')
    await flushPromises()

    expect(hadForm).toBe(true)
    showModal.mockRestore()
  })

  it('edits the entry of a row in a dialog', async () => {
    vi.mocked(updateWeightEntry).mockResolvedValue({ ...entries[1]!, weightKg: 81.9 })
    const wrapper = await mountView()

    await rowButton(wrapper, 1, 'Edit').trigger('click')
    expect(wrapper.find<HTMLDialogElement>('dialog').element.open).toBe(true)
    expect(wrapper.find<HTMLInputElement>('dialog #weightKg').element.value).toBe('82.1')

    await wrapper.find('dialog #weightKg').setValue('81.9')
    await wrapper.find('dialog form').trigger('submit')
    await flushPromises()

    expect(updateWeightEntry).toHaveBeenCalledWith(entries[1]!.id, {
      measuredAt: '2026-10-03T06:45:00.000Z',
      weightKg: 81.9,
    })
    expect(listWeightEntries).toHaveBeenCalledTimes(2)
    expect(wrapper.find<HTMLDialogElement>('dialog').element.open).toBe(false)
  })

  it('closes the dialog on cancel', async () => {
    const wrapper = await mountView()

    await rowButton(wrapper, 0, 'Edit').trigger('click')
    await wrapper.find('dialog button[type="button"]').trigger('click')

    expect(wrapper.find<HTMLDialogElement>('dialog').element.open).toBe(false)
    expect(wrapper.find('dialog form').exists()).toBe(false)
  })

  it('drops the edit when the dialog closes another way', async () => {
    const wrapper = await mountView()

    await rowButton(wrapper, 0, 'Edit').trigger('click')
    wrapper.find<HTMLDialogElement>('dialog').element.close()
    await flushPromises()

    expect(wrapper.find('dialog form').exists()).toBe(false)
  })

  it('deletes the entry of a row and reloads the list', async () => {
    vi.mocked(deleteWeightEntry).mockResolvedValue()
    const wrapper = await mountView()

    await rowButton(wrapper, 0, 'Delete').trigger('click')
    await flushPromises()

    expect(deleteWeightEntry).toHaveBeenCalledWith(entries[0]!.id)
    expect(listWeightEntries).toHaveBeenCalledTimes(2)
  })

  it("puts a 400's errors onto the fields", async () => {
    vi.mocked(createWeightEntry).mockRejectedValue(
      failedWith(400, { errors: { weightKg: 'Between 20 and 400 kg, one decimal.' } }),
    )
    const wrapper = await mountView()

    await button(wrapper, 'Log weight').trigger('click')
    await wrapper.find('dialog #weightKg').setValue('82.4')
    await wrapper.find('dialog form').trigger('submit')
    await flushPromises()

    expect(wrapper.find('dialog #weightKg + .invalid-feedback').text()).toBe(
      'Between 20 and 400 kg, one decimal.',
    )
  })
})
