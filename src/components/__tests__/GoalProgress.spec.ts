import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import GoalProgress from '../GoalProgress.vue'

const progress = { latestKg: 81.8, targetKg: 75, kgToGo: -6.8, kgPerWeek: -0.4 }

describe('GoalProgress', () => {
  it('shows the latest weight and the goal', () => {
    const wrapper = mount(GoalProgress, { props: { progress } })

    expect(wrapper.text()).toContain('81.8 kg')
    expect(wrapper.text()).toContain('75.0 kg')
  })

  it('shows kg to lose and the weekly trend', () => {
    const wrapper = mount(GoalProgress, { props: { progress } })

    expect(wrapper.text()).toContain('6.8 kg to lose')
    expect(wrapper.text()).toContain('-0.4 kg per week')
  })

  it('shows kg to gain', () => {
    const wrapper = mount(GoalProgress, {
      props: { progress: { ...progress, targetKg: 85, kgToGo: 3.2, kgPerWeek: 0.3 } },
    })

    expect(wrapper.text()).toContain('3.2 kg to gain')
    expect(wrapper.text()).toContain('+0.3 kg per week')
  })

  it('shows a reached goal', () => {
    const wrapper = mount(GoalProgress, {
      props: { progress: { ...progress, targetKg: 81.8, kgToGo: 0 } },
    })

    expect(wrapper.text()).toContain('Goal reached')
  })

  it('explains a missing trend', () => {
    const wrapper = mount(GoalProgress, { props: { progress: { ...progress, kgPerWeek: null } } })

    expect(wrapper.text()).toContain('No trend yet: log at least 2 weights over 7 days.')
  })
})
