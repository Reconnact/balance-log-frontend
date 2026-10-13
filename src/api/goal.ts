import { isAxiosError } from 'axios'
import client from './client'
import type { Goal, Progress } from '@/types'

async function nullOn404<T>(request: Promise<{ data: T }>): Promise<T | null> {
  try {
    return (await request).data
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) return null
    throw error
  }
}

export async function getGoal(): Promise<Goal | null> {
  return nullOn404(client.get<Goal>('/goal'))
}

export async function setGoal(targetKg: number): Promise<Goal> {
  return (await client.put<Goal>('/goal', { targetKg })).data
}

export async function getProgress(): Promise<Progress | null> {
  return nullOn404(client.get<Progress>('/progress'))
}
