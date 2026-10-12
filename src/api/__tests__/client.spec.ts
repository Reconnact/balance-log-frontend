import { afterEach, describe, expect, it } from 'vitest'
import type { InternalAxiosRequestConfig } from 'axios'
import client from '../client'
import { token } from '@/auth'

async function sentHeaders() {
  const response = await client.get('/profile', {
    adapter: async (config: InternalAxiosRequestConfig) => ({
      data: null,
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
    }),
  })
  return response.config.headers
}

describe('client', () => {
  afterEach(() => {
    token.value = null
  })

  it('sends the token as a bearer header', async () => {
    token.value = 'abc'

    expect((await sentHeaders()).Authorization).toBe('Bearer abc')
  })

  it('sends no Authorization header without a token', async () => {
    expect((await sentHeaders()).Authorization).toBeUndefined()
  })
})
