import { afterEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import AppNav from '../AppNav.vue'
import router from '@/router'
import { token } from '@/auth'

async function mountLoggedIn() {
  token.value = 'abc'
  await router.push('/weights')
  return mount(AppNav, { global: { plugins: [router] }, attachTo: document.body })
}

describe('AppNav', () => {
  afterEach(() => {
    token.value = null
    document.body.innerHTML = ''
  })

  it('opens and closes the menu with the menu button', async () => {
    const wrapper = await mountLoggedIn()
    const button = wrapper.find('[aria-controls="nav-menu"]')

    expect(button.attributes('aria-expanded')).toBe('false')
    expect(wrapper.find('#nav-menu').isVisible()).toBe(false)

    await button.trigger('click')

    expect(button.attributes('aria-expanded')).toBe('true')
    expect(wrapper.find('#nav-menu').isVisible()).toBe(true)
  })

  it('closes the menu after a link was followed', async () => {
    const wrapper = await mountLoggedIn()
    await wrapper.find('[aria-controls="nav-menu"]').trigger('click')

    await wrapper.find('#nav-menu a[href="/goal"]').trigger('click')
    await vi.waitFor(() => expect(router.currentRoute.value.path).toBe('/goal'))
    await flushPromises()

    expect(wrapper.find('#nav-menu').isVisible()).toBe(false)
  })

  it('logs out to the login page', async () => {
    const wrapper = await mountLoggedIn()

    const logOut = wrapper.findAll('#nav-menu button').find((b) => b.text() === 'Log out')
    await logOut!.trigger('click')
    await vi.waitFor(() => expect(router.currentRoute.value.path).toBe('/login'))

    expect(token.value).toBeNull()
  })

  it('shows only the brand and the theme toggle when logged out', async () => {
    await router.push('/login')
    const wrapper = mount(AppNav, { global: { plugins: [router] } })

    expect(wrapper.find('[aria-controls="nav-menu"]').exists()).toBe(false)
    expect(wrapper.findAll('a').map((a) => a.text())).toEqual(['Balance Log'])
    expect(wrapper.find('[aria-label^="Theme"]').exists()).toBe(true)
  })
})
