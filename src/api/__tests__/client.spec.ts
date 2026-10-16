import { afterEach, describe, expect, it, vi } from 'vitest'
import { AxiosError, type AxiosAdapter, type InternalAxiosRequestConfig } from 'axios'
import client, { slowRequests } from '../client'
import { token } from '@/auth'
import router from '@/router'
import { toasts } from '@/toasts'

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

function answering(status: number): AxiosAdapter {
  return async (config) => {
    throw new AxiosError('Request failed', undefined, config, undefined, {
      status,
      statusText: '',
      headers: {},
      config,
      data: {},
    })
  }
}

const noResponse: AxiosAdapter = async (config) => {
  throw new AxiosError('Network Error', AxiosError.ERR_NETWORK, config)
}

const cancelled: AxiosAdapter = async (config) => {
  throw new AxiosError('Request aborted', AxiosError.ECONNABORTED, config)
}

async function failing(adapter: AxiosAdapter) {
  await client.get('/weight-entries', { adapter }).catch(() => {})
}

describe('client', () => {
  afterEach(() => {
    token.value = null
    toasts.value = []
  })

  it('sends the token as a bearer header', async () => {
    token.value = 'abc'

    expect((await sentHeaders()).Authorization).toBe('Bearer abc')
  })

  it('sends no Authorization header without a token', async () => {
    expect((await sentHeaders()).Authorization).toBeUndefined()
  })

  it('gives up after 120 seconds', () => {
    expect(client.defaults.timeout).toBe(120_000)
  })

  it('reports a timeout apart from a cancelled request', () => {
    expect(client.defaults.transitional?.clarifyTimeoutError).toBe(true)
  })

  it('sends a 401 with a token to login with the page and the expired note', async () => {
    token.value = 'abc'
    await router.push('/goal')

    await failing(answering(401))

    await vi.waitFor(() => expect(router.currentRoute.value.path).toBe('/login'))
    expect(token.value).toBeNull()
    expect(router.currentRoute.value.query).toEqual({ redirect: '/goal', expired: '1' })
  })

  it('leaves a 401 without a token to the form', async () => {
    await router.push('/login')

    await failing(answering(401))

    expect(router.currentRoute.value.query).toEqual({})
    expect(toasts.value).toEqual([])
  })

  it('shows a toast when the server does not answer', async () => {
    await failing(noResponse)

    expect(toasts.value.map((t) => [t.text, t.kind])).toEqual([
      ['No connection to the server. Check your connection and try again.', 'error'],
    ])
  })

  it('shows no toast for a request the browser cancelled', async () => {
    await failing(cancelled)

    expect(toasts.value).toEqual([])
  })

  it('shows a toast on a server error', async () => {
    await failing(answering(503))

    expect(toasts.value.map((t) => [t.text, t.kind])).toEqual([
      ['The server had a problem. Try again in a moment.', 'error'],
    ])
  })

  it('leaves a 400 to the form', async () => {
    await failing(answering(400))

    expect(toasts.value).toEqual([])
  })

  describe('a slow request', () => {
    afterEach(() => {
      vi.useRealTimers()
    })

    function pending() {
      let settle!: (ok: boolean) => void
      const adapter: AxiosAdapter = (config) =>
        new Promise((resolve, reject) => {
          settle = (ok) =>
            ok
              ? resolve({ data: null, status: 200, statusText: 'OK', headers: {}, config })
              : reject(new AxiosError('Network Error', AxiosError.ERR_NETWORK, config))
        })
      const request = client.get('/weight-entries', { adapter }).catch(() => {})
      return { request, settle: (ok: boolean) => settle(ok) }
    }

    it('counts as slow after 5 seconds until it answers', async () => {
      vi.useFakeTimers()
      const { request, settle } = pending()
      await vi.advanceTimersByTimeAsync(4999)

      expect(slowRequests.value).toBe(0)

      await vi.advanceTimersByTimeAsync(1)

      expect(slowRequests.value).toBe(1)

      settle(true)
      await request

      expect(slowRequests.value).toBe(0)
    })

    it('stops counting when it fails', async () => {
      vi.useFakeTimers()
      const { request, settle } = pending()
      await vi.advanceTimersByTimeAsync(5000)

      settle(false)
      await request

      expect(slowRequests.value).toBe(0)
    })

    it('never counts a fast request', async () => {
      vi.useFakeTimers()
      const { request, settle } = pending()
      await vi.advanceTimersByTimeAsync(100)
      settle(true)
      await request
      await vi.advanceTimersByTimeAsync(5000)

      expect(slowRequests.value).toBe(0)
    })
  })
})
