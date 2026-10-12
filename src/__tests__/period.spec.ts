import { describe, expect, it } from 'vitest'
import { periodFrom } from '../period'

const now = new Date('2026-10-12T10:00:00Z')

describe('periodFrom', () => {
  it.each([
    ['week', '2026-10-05T10:00:00.000Z'],
    ['month', '2026-09-12T10:00:00.000Z'],
    ['year', '2025-10-12T10:00:00.000Z'],
  ] as const)('starts %s that many days back', (period, from) => {
    expect(periodFrom(period, now)).toBe(from)
  })

  it('sends no from for all', () => {
    expect(periodFrom('all', now)).toBeUndefined()
  })
})
