import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { AxiosError, AxiosHeaders } from 'axios'
import GoalView from '../GoalView.vue'
import { getGoal, getProgress, setGoal } from '@/api/goal'
import { toasts } from '@/toasts'

vi.mock('@/api/goal')

const progress = { latestKg: 81.8, targetKg: 75, kgToGo: -6.8, kgPerWeek: -0.4 }

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
  const wrapper = mount(GoalView)
  await flushPromises()
  return wrapper
}

describe('GoalView', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    toasts.value = []
  })

  it('shows the goal and the progress', async () => {
    vi.mocked(getGoal).mockResolvedValue({ targetKg: 75 })
    vi.mocked(getProgress).mockResolvedValue(progress)

    const wrapper = await mountView()

    expect(wrapper.find<HTMLInputElement>('#targetKg').element.value).toBe('75')
    expect(wrapper.text()).toContain('6.8 kg to lose')
  })

  it('asks for a goal when none is set', async () => {
    vi.mocked(getGoal).mockResolvedValue(null)
    vi.mocked(getProgress).mockResolvedValue(null)

    const wrapper = await mountView()

    expect(wrapper.find<HTMLInputElement>('#targetKg').element.value).toBe('')
    expect(wrapper.text()).toContain('Set a goal to see your progress.')
  })

  it('asks for a weight when the goal has none to compare', async () => {
    vi.mocked(getGoal).mockResolvedValue({ targetKg: 75 })
    vi.mocked(getProgress).mockResolvedValue(null)

    const wrapper = await mountView()

    expect(wrapper.text()).toContain('Log a weight to see your progress.')
  })

  it('reloads the progress after the goal is set', async () => {
    vi.mocked(getGoal).mockResolvedValue(null)
    vi.mocked(getProgress).mockResolvedValueOnce(null).mockResolvedValue(progress)
    vi.mocked(setGoal).mockResolvedValue({ targetKg: 75 })
    const wrapper = await mountView()

    await wrapper.find('#targetKg').setValue('75')
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(getProgress).toHaveBeenCalledTimes(2)
    expect(wrapper.text()).toContain('6.8 kg to lose')
  })

  it('confirms a set goal with a toast', async () => {
    vi.mocked(getGoal).mockResolvedValue(null)
    vi.mocked(getProgress).mockResolvedValue(null)
    vi.mocked(setGoal).mockResolvedValue({ targetKg: 75 })
    const wrapper = await mountView()

    await wrapper.find('#targetKg').setValue('75')
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(toasts.value.map((t) => t.text)).toEqual(['Goal set'])
  })

  it('shows skeleton panels until the first load arrives', async () => {
    let arrive!: (goal: { targetKg: number }) => void
    vi.mocked(getGoal).mockReturnValue(new Promise((resolve) => (arrive = resolve)))
    vi.mocked(getProgress).mockResolvedValue(progress)
    const wrapper = await mountView()

    expect(wrapper.find('[aria-busy="true"]').exists()).toBe(true)
    expect(wrapper.find('form').exists()).toBe(false)

    arrive({ targetKg: 75 })
    await flushPromises()

    expect(wrapper.find('[aria-busy="true"]').exists()).toBe(false)
    expect(wrapper.find('form').exists()).toBe(true)
  })

  it('offers Try again after a failed load', async () => {
    vi.mocked(getGoal)
      .mockRejectedValueOnce(failedWith(503, {}))
      .mockResolvedValue({ targetKg: 75 })
    vi.mocked(getProgress).mockResolvedValue(progress)
    const wrapper = await mountView()

    expect(wrapper.text()).toContain('Not loaded.')
    expect(wrapper.find('form').exists()).toBe(false)

    await wrapper
      .findAll('button')
      .find((b) => b.text() === 'Try again')!
      .trigger('click')
    await flushPromises()

    expect(wrapper.text()).not.toContain('Not loaded.')
    expect(wrapper.text()).toContain('6.8 kg to lose')
  })
})
