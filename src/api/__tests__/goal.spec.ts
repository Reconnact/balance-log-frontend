import { describe, expect, it, vi } from 'vitest'
import { AxiosError, AxiosHeaders } from 'axios'
import client from '../client'
import { getGoal, getProgress } from '../goal'

vi.mock('../client', () => ({ default: { get: vi.fn<(url: string) => Promise<unknown>>() } }))

function failedWith(status: number) {
  const config = { headers: new AxiosHeaders() }
  return new AxiosError('Request failed', undefined, config, undefined, {
    status,
    statusText: '',
    headers: {},
    config,
    data: null,
  })
}

describe('goal API', () => {
  it.each([getGoal, getProgress])('%o gives null for a 404', async (get) => {
    vi.mocked(client.get).mockRejectedValue(failedWith(404))

    expect(await get()).toBeNull()
  })

  it.each([getGoal, getProgress])('%o passes other errors on', async (get) => {
    vi.mocked(client.get).mockRejectedValue(failedWith(500))

    await expect(get()).rejects.toThrow('Request failed')
  })
})
