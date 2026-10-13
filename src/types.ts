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

export interface Goal {
  targetKg: number
}

export interface Progress {
  latestKg: number
  targetKg: number
  kgToGo: number
  kgPerWeek: number | null
}
