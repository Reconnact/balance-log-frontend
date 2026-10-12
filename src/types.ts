export interface WeightEntry {
  id: string
  measuredAt: string
  weightKg: number
}

export interface TokenResponse {
  token: string
  expiresAt: string
}

export interface UserResponse {
  id: string
  email: string
}
