import { afterEach, describe, expect, it } from 'vitest'
import router from '@/router'
import { token } from '@/auth'

describe('router guard', () => {
  afterEach(() => {
    token.value = null
  })

  it('sends to /login with the path as redirect without a token', async () => {
    await router.push('/weights')

    expect(router.currentRoute.value.path).toBe('/login')
    expect(router.currentRoute.value.query.redirect).toBe('/weights')
  })

  it('sends a logged-in user from login and register to the weights', async () => {
    token.value = 'abc'

    await router.push('/login')
    expect(router.currentRoute.value.path).toBe('/weights')

    await router.push('/register')
    expect(router.currentRoute.value.path).toBe('/weights')
  })

  it('lets the route through with a token', async () => {
    token.value = 'abc'

    await router.push('/weights')

    expect(router.currentRoute.value.path).toBe('/weights')
  })
})

describe('tab title', () => {
  afterEach(() => {
    token.value = null
  })

  it('names the page before the app', async () => {
    token.value = 'abc'

    await router.push('/weights')
    expect(document.title).toBe('Weights · Balance Log')

    await router.push('/goal')
    expect(document.title).toBe('Goal · Balance Log')
  })

  it('names an unknown path as not found', async () => {
    token.value = 'abc'

    await router.push('/nope')

    expect(router.currentRoute.value.path).toBe('/nope')
    expect(document.title).toBe('Not found · Balance Log')
  })

  it('shows the app name on a page without a title', async () => {
    await router.push('/login')

    expect(document.title).toBe('Balance Log')
  })
})
