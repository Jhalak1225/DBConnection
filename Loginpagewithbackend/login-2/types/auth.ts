export interface User {
  id: string
  email: string
  name: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignupCredentials {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export interface SessionData {
  userId: string
  email: string
  name: string
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  error: string | null
}

export interface ResetTokenData {
  userId: string
  email: string
  expiresAt: Date
}
