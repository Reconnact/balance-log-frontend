import { describe, expect, it } from 'vitest'
import { measuredAtError, weightKgError } from '../validation'

describe('weightKgError', () => {
  it.each([20, 82.4, 400])('accepts %s', (kg) => {
    expect(weightKgError(kg)).toBeUndefined()
  })

  it.each<number | ''>(['', 19.9, 400.1, 82.45])('rejects %s', (kg) => {
    expect(weightKgError(kg)).toBe('Between 20 and 400 kg, one decimal.')
  })
})

describe('measuredAtError', () => {
  it('accepts a past time', () => {
    expect(measuredAtError('2026-10-01T08:30', true)).toBeUndefined()
  })

  it('rejects a future time', () => {
    expect(measuredAtError('2999-01-01T00:00', false)).toBe("Can't be in the future.")
  })

  it('accepts no time when it is optional', () => {
    expect(measuredAtError('', false)).toBeUndefined()
  })

  it('rejects no time when it is required', () => {
    expect(measuredAtError('', true)).toBe('Enter a time.')
  })
})
