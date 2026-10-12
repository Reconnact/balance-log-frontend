import { afterEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { AxiosError, AxiosHeaders } from 'axios'
import WeightForm from '../WeightForm.vue'
import { createWeightEntry, updateWeightEntry } from '@/api/weights'

vi.mock('@/api/weights')

const entry = {
  id: '3f2b8c1e-6d4a-4f7e-9b2a-1c5d8e0f4a71',
  measuredAt: '2026-10-01T06:30:00Z',
  weightKg: 82.4,
}

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

describe('WeightForm', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('logs an entry at the current minute and emits saved', async () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date('2026-10-12T10:00:30Z'))
    vi.mocked(createWeightEntry).mockResolvedValue(entry)
    const wrapper = mount(WeightForm)

    await wrapper.find('#weightKg').setValue('82.4')
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(createWeightEntry).toHaveBeenCalledWith({
      measuredAt: '2026-10-12T10:00:00.000Z',
      weightKg: 82.4,
    })
    expect(wrapper.emitted('saved')).toEqual([[entry]])
  })

  it('logs an entry without a time when the field is cleared', async () => {
    vi.mocked(createWeightEntry).mockResolvedValue(entry)
    const wrapper = mount(WeightForm)

    await wrapper.find('#weightKg').setValue('82.4')
    await wrapper.find('#measuredAt').setValue('')
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(createWeightEntry).toHaveBeenLastCalledWith({ weightKg: 82.4 })
  })

  it('edits an entry with its time and emits saved', async () => {
    const edited = { ...entry, weightKg: 82.1 }
    vi.mocked(updateWeightEntry).mockResolvedValue(edited)
    const wrapper = mount(WeightForm, { props: { entry } })

    await wrapper.find('#weightKg').setValue('82.1')
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(updateWeightEntry).toHaveBeenCalledWith(entry.id, {
      measuredAt: '2026-10-01T06:30:00.000Z',
      weightKg: 82.1,
    })
    expect(wrapper.emitted('saved')).toEqual([[edited]])
  })

  it('shows a broken rule at its field and sends nothing', async () => {
    vi.mocked(createWeightEntry).mockClear()
    const wrapper = mount(WeightForm)

    await wrapper.find('#weightKg').setValue('500')
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(wrapper.find('#weightKg').classes()).toContain('is-invalid')
    expect(wrapper.find('#weightKg + .invalid-feedback').text()).toBe(
      'Between 20 and 400 kg, one decimal.',
    )
    expect(createWeightEntry).not.toHaveBeenCalled()
  })

  it("puts a 400's errors onto the fields", async () => {
    vi.mocked(createWeightEntry).mockRejectedValue(
      failedWith(400, { errors: { measuredAt: "Can't be in the future." } }),
    )
    const wrapper = mount(WeightForm)

    await wrapper.find('#weightKg').setValue('82.4')
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(wrapper.find('#measuredAt').classes()).toContain('is-invalid')
    expect(wrapper.find('#measuredAt + .invalid-feedback').text()).toBe("Can't be in the future.")
    expect(wrapper.emitted('saved')).toBeUndefined()
  })

  it('emits cancel', async () => {
    const wrapper = mount(WeightForm)

    await wrapper.find('button[type="button"]').trigger('click')

    expect(wrapper.emitted('cancel')).toHaveLength(1)
  })
})
