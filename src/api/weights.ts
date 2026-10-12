import client from './client'
import type { WeightEntry } from '@/types'

export async function listWeightEntries(): Promise<WeightEntry[]> {
  return (await client.get<WeightEntry[]>('/weight-entries')).data
}

export interface WeightEntryRequest {
  measuredAt?: string
  weightKg: number
}

export async function createWeightEntry(request: WeightEntryRequest): Promise<WeightEntry> {
  return (await client.post<WeightEntry>('/weight-entries', request)).data
}

export async function updateWeightEntry(
  id: string,
  request: WeightEntryRequest,
): Promise<WeightEntry> {
  return (await client.put<WeightEntry>(`/weight-entries/${id}`, request)).data
}
