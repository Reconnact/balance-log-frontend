import { describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { AxiosError, AxiosHeaders } from 'axios'
import RegisterView from '../RegisterView.vue'
import router from '@/router'
import { register } from '@/api/auth'

vi.mock('@/api/auth')

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

describe('RegisterView', () => {
  it("puts a 409's message at the email field", async () => {
    vi.mocked(register).mockRejectedValue(
      failedWith(409, { detail: 'This email is already registered.' }),
    )
    const wrapper = mount(RegisterView, { global: { plugins: [router] } })

    await wrapper.find('form').trigger('submit')
    await flushPromises()

    const email = wrapper.find('#email')
    expect(email.attributes('aria-invalid')).toBe('true')
    expect(wrapper.find(`#${email.attributes('aria-describedby')}`).text()).toBe(
      'This email is already registered.',
    )
  })

  it('disables the button and shows it busy while registering', async () => {
    vi.mocked(register).mockReturnValue(new Promise(() => {}))
    const wrapper = mount(RegisterView, { global: { plugins: [router] } })

    await wrapper.find('form').trigger('submit')

    const button = wrapper.find('button[type="submit"]')
    expect(button.attributes('disabled')).toBeDefined()
    expect(button.attributes('aria-busy')).toBe('true')
  })
})
