import client from './client'
import type { WeightEntry } from '@/types'

export async function listWeightEntries(from?: string): Promise<WeightEntry[]> {
  return (await client.get<WeightEntry[]>('/weight-entries', { params: { from } })).data
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

export async function deleteWeightEntry(id: string): Promise<void> {
  await client.delete(`/weight-entries/${id}`)
}
