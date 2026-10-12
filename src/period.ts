export type Period = 'week' | 'month' | 'year' | 'all'

const days = { week: 7, month: 30, year: 365 }

export function periodFrom(period: Period, now: Date): string | undefined {
  if (period === 'all') return undefined
  return new Date(now.getTime() - days[period] * 86_400_000).toISOString()
}
