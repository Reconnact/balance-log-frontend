import client from './client'
import type { WeightEntry } from '@/types'

export async function listWeightEntries(): Promise<WeightEntry[]> {
  return (await client.get<WeightEntry[]>('/weight-entries')).data
}
