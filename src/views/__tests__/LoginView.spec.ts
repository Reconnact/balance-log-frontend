import { describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { AxiosError, AxiosHeaders } from 'axios'
import LoginView from '../LoginView.vue'
import router from '@/router'
import { login } from '@/api/auth'

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

async function submit() {
  const wrapper = mount(LoginView, { global: { plugins: [router] } })
  await wrapper.find('form').trigger('submit')
  await flushPromises()
  return wrapper
}

describe('LoginView', () => {
  it("puts a 400's errors onto the fields", async () => {
    vi.mocked(login).mockRejectedValue(
      failedWith(400, {
        errors: { email: 'Enter a valid email address.', password: '8 to 72 characters.' },
      }),
    )

    const wrapper = await submit()

    expect(wrapper.find('#email').classes()).toContain('is-invalid')
    expect(wrapper.find('#email + .invalid-feedback').text()).toBe('Enter a valid email address.')
    expect(wrapper.find('#password').classes()).toContain('is-invalid')
    expect(wrapper.find('#password + .invalid-feedback').text()).toBe('8 to 72 characters.')
  })

  it("shows a 401's message", async () => {
    vi.mocked(login).mockRejectedValue(failedWith(401, { detail: 'Wrong email or password.' }))

    const wrapper = await submit()

    expect(wrapper.text()).toContain('Wrong email or password.')
    expect(wrapper.find('.is-invalid').exists()).toBe(false)
  })
})
