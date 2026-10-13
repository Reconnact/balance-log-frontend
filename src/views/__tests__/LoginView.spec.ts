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

    for (const [field, message] of [
      ['email', 'Enter a valid email address.'],
      ['password', '8 to 72 characters.'],
    ]) {
      const input = wrapper.find(`#${field}`)
      expect(input.attributes('aria-invalid')).toBe('true')
      expect(wrapper.find(`#${input.attributes('aria-describedby')}`).text()).toBe(message)
    }
  })

  it("shows a 401's message", async () => {
    vi.mocked(login).mockRejectedValue(failedWith(401, { detail: 'Wrong email or password.' }))

    const wrapper = await submit()

    expect(wrapper.text()).toContain('Wrong email or password.')
    expect(wrapper.find('[aria-invalid="true"]').exists()).toBe(false)
  })
})

describe('LoginView while logging in', () => {
  it('disables the button and shows it busy', async () => {
    vi.mocked(login).mockReturnValue(new Promise(() => {}))
    const wrapper = mount(LoginView, { global: { plugins: [router] } })

    await wrapper.find('form').trigger('submit')

    const button = wrapper.find('button[type="submit"]')
    expect(button.attributes('disabled')).toBeDefined()
    expect(button.attributes('aria-busy')).toBe('true')
  })
})

describe('LoginView after an expired session', () => {
  it('says the session expired', async () => {
    await router.push('/login?redirect=/goal&expired=1')

    const wrapper = mount(LoginView, { global: { plugins: [router] } })

    expect(wrapper.text()).toContain('Your session expired. Log in again.')
  })
})
