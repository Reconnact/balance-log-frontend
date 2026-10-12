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

  it('lets the route through with a token', async () => {
    token.value = 'abc'

    await router.push('/weights')

    expect(router.currentRoute.value.path).toBe('/weights')
  })
})
