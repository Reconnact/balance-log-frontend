import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import GoalView from '../GoalView.vue'
import { getGoal, getProgress, setGoal } from '@/api/goal'

vi.mock('@/api/goal')

const progress = { latestKg: 81.8, targetKg: 75, kgToGo: -6.8, kgPerWeek: -0.4 }

async function mountView() {
  const wrapper = mount(GoalView)
  await flushPromises()
  return wrapper
}

describe('GoalView', () => {
  beforeEach(() => {
    vi.clearAllMocks()
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
})
