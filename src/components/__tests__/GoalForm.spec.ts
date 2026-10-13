import { describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { AxiosError, AxiosHeaders } from 'axios'
import GoalForm from '../GoalForm.vue'
import { setGoal } from '@/api/goal'

vi.mock('@/api/goal')

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

describe('GoalForm', () => {
  it('shows the current goal', () => {
    const wrapper = mount(GoalForm, { props: { targetKg: 75 } })

    expect(wrapper.find<HTMLInputElement>('#targetKg').element.value).toBe('75')
  })

  it('sets the goal and emits saved', async () => {
    vi.mocked(setGoal).mockResolvedValue({ targetKg: 74.5 })
    const wrapper = mount(GoalForm)

    await wrapper.find('#targetKg').setValue('74.5')
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(setGoal).toHaveBeenCalledWith(74.5)
    expect(wrapper.emitted('saved')).toEqual([[{ targetKg: 74.5 }]])
  })

  it('shows a broken rule at the field and sends nothing', async () => {
    vi.mocked(setGoal).mockClear()
    const wrapper = mount(GoalForm)

    await wrapper.find('#targetKg').setValue('10')
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    const input = wrapper.find('#targetKg')
    expect(input.attributes('aria-invalid')).toBe('true')
    expect(wrapper.find(`#${input.attributes('aria-describedby')}`).text()).toBe(
      'Between 20 and 400 kg, one decimal.',
    )
    expect(setGoal).not.toHaveBeenCalled()
  })

  it("puts a 400's error onto the field", async () => {
    vi.mocked(setGoal).mockRejectedValue(
      failedWith(400, { errors: { targetKg: 'Between 20 and 400 kg, one decimal.' } }),
    )
    const wrapper = mount(GoalForm)

    await wrapper.find('#targetKg').setValue('75')
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(wrapper.find('#targetKg').attributes('aria-invalid')).toBe('true')
    expect(wrapper.emitted('saved')).toBeUndefined()
  })

  it('shows the button busy while saving', async () => {
    vi.mocked(setGoal).mockReturnValue(new Promise(() => {}))
    const wrapper = mount(GoalForm)

    await wrapper.find('#targetKg').setValue('75')
    await wrapper.find('form').trigger('submit')

    const button = wrapper.find('button[type="submit"]')
    expect(button.attributes('disabled')).toBeDefined()
    expect(button.attributes('aria-busy')).toBe('true')
  })
})
