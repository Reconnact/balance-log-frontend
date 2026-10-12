import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import PeriodFilter from '../PeriodFilter.vue'

describe('PeriodFilter', () => {
  it('checks the current period', () => {
    const wrapper = mount(PeriodFilter, { props: { modelValue: 'month' } })

    expect(wrapper.find<HTMLInputElement>('#period-month').element.checked).toBe(true)
    expect(wrapper.find<HTMLInputElement>('#period-all').element.checked).toBe(false)
  })

  it('emits the chosen period', async () => {
    const wrapper = mount(PeriodFilter, { props: { modelValue: 'all' } })

    await wrapper.find('#period-week').setValue(true)

    expect(wrapper.emitted('update:modelValue')).toEqual([['week']])
  })
})
