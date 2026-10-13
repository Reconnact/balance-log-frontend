import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import PasswordInput from '../PasswordInput.vue'

describe('PasswordInput', () => {
  it('hides the password until the eye is pressed', async () => {
    const wrapper = mount(PasswordInput, { props: { modelValue: '' } })
    const eye = wrapper.find('button')

    expect(wrapper.find('input').attributes('type')).toBe('password')
    expect(eye.attributes('aria-pressed')).toBe('false')

    await eye.trigger('click')

    expect(wrapper.find('input').attributes('type')).toBe('text')
    expect(eye.attributes('aria-pressed')).toBe('true')
  })

  it('passes its attributes to the input', () => {
    const wrapper = mount(PasswordInput, {
      props: { modelValue: '' },
      attrs: { id: 'password', autocomplete: 'new-password', 'aria-invalid': 'true' },
    })

    expect(wrapper.find('input').attributes()).toMatchObject({
      id: 'password',
      autocomplete: 'new-password',
      'aria-invalid': 'true',
    })
  })

  it('updates the model', async () => {
    const wrapper = mount(PasswordInput, { props: { modelValue: '' } })

    await wrapper.find('input').setValue('secret123')

    expect(wrapper.emitted('update:modelValue')).toEqual([['secret123']])
  })
})
