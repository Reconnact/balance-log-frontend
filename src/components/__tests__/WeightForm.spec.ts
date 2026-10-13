import { afterEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
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

function errorOf(wrapper: VueWrapper, field: string) {
  const input = wrapper.find(`#${field}`)
  expect(input.attributes('aria-invalid')).toBe('true')
  return wrapper.find(`#${input.attributes('aria-describedby')}`).text()
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

  it('starts a new entry at the last weight', () => {
    const wrapper = mount(WeightForm, { props: { lastKg: 82.1 } })

    expect(wrapper.find<HTMLInputElement>('#weightKg').element.value).toBe('82.1')
  })

  it('blocks letters in the weight field', () => {
    const input = mount(WeightForm).find('#weightKg').element
    const typed = (data: string) => {
      const event = new InputEvent('beforeinput', { data, cancelable: true })
      input.dispatchEvent(event)
      return event.defaultPrevented
    }

    expect(typed('a')).toBe(true)
    expect(typed('e')).toBe(true)
    expect(typed('8')).toBe(false)
    expect(typed('.')).toBe(false)
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

    expect(errorOf(wrapper, 'weightKg')).toBe('Between 20 and 400 kg, one decimal.')
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

    expect(errorOf(wrapper, 'measuredAt')).toBe("Can't be in the future.")
    expect(wrapper.emitted('saved')).toBeUndefined()
  })

  it('shows the save button busy while saving', async () => {
    vi.mocked(createWeightEntry).mockReturnValue(new Promise(() => {}))
    const wrapper = mount(WeightForm)

    await wrapper.find('#weightKg').setValue('82.4')
    await wrapper.find('form').trigger('submit')

    const save = wrapper.find('button[type="submit"]')
    expect(save.attributes('disabled')).toBeDefined()
    expect(save.attributes('aria-busy')).toBe('true')
  })

  it('keeps the input and frees the button after a failed save', async () => {
    vi.mocked(createWeightEntry).mockRejectedValue(failedWith(503, {}))
    // the form rethrows what it can't show; the client already toasted it
    const wrapper = mount(WeightForm, { global: { config: { errorHandler: () => {} } } })

    await wrapper.find('#weightKg').setValue('82.4')
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(wrapper.find<HTMLInputElement>('#weightKg').element.value).toBe('82.4')
    expect(wrapper.find('button[type="submit"]').attributes('disabled')).toBeUndefined()
    expect(wrapper.emitted('saved')).toBeUndefined()
  })

  it('emits cancel', async () => {
    const wrapper = mount(WeightForm)

    await wrapper
      .findAll('button')
      .find((b) => b.text() === 'Cancel')!
      .trigger('click')

    expect(wrapper.emitted('cancel')).toHaveLength(1)
  })
})
