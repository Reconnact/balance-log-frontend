import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import KgInput from '../KgInput.vue'

describe('KgInput', () => {
  it('steps a whole kg, from a decimal to the next whole kg', async () => {
    const wrapper = mount(KgInput, {
      props: {
        modelValue: 82.4,
        'onUpdate:modelValue': (value: number | '') => wrapper.setProps({ modelValue: value }),
      },
    })
    const input = wrapper.find<HTMLInputElement>('input').element
    const step = (label: string) => wrapper.find(`[aria-label="${label}"]`).trigger('click')

    await step('1 kg more')
    expect(input.value).toBe('83')
    await step('1 kg more')
    expect(input.value).toBe('84')

    await wrapper.setProps({ modelValue: 82.4 })
    await step('1 kg less')
    expect(input.value).toBe('82')
    await step('1 kg less')
    expect(input.value).toBe('81')
  })

  it('passes its attributes to the input', () => {
    const wrapper = mount(KgInput, {
      props: { modelValue: '' },
      attrs: { id: 'weightKg', 'aria-invalid': 'true' },
    })

    expect(wrapper.find('input').attributes()).toMatchObject({
      id: 'weightKg',
      'aria-invalid': 'true',
    })
  })
})
