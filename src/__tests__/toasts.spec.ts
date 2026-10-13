import { afterEach, describe, expect, it, vi } from 'vitest'
import { showToast, toasts } from '@/toasts'

describe('toasts', () => {
  afterEach(() => {
    vi.useRealTimers()
    toasts.value = []
  })

  it('shows a toast for 4 seconds', () => {
    vi.useFakeTimers()

    showToast('Weight logged')
    vi.advanceTimersByTime(3999)

    expect(toasts.value.map((t) => t.text)).toEqual(['Weight logged'])

    vi.advanceTimersByTime(1)

    expect(toasts.value).toEqual([])
  })

  it('marks an error toast', () => {
    showToast('The server had a problem. Try again in a moment.', 'error')

    expect(toasts.value[0]?.kind).toBe('error')
  })
})
