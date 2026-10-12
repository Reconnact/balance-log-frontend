import client from './client'
import type { TokenResponse, UserResponse } from '@/types'

export async function register(email: string, password: string): Promise<UserResponse> {
  return (await client.post<UserResponse>('/auth/register', { email, password })).data
}

export async function login(email: string, password: string): Promise<TokenResponse> {
  return (await client.post<TokenResponse>('/auth/login', { email, password })).data
}
