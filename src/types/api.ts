export interface ApiErrorDetail {
  field: string
  message: string
  code: string
}

export interface ApiError {
  code: string
  message: string
  details?: ApiErrorDetail[]
}

export default interface ApiResponse<T = unknown> {
  success: boolean
  message?: string
  data: T
  error?: ApiError
  timestamp?: string
}

export interface ApiResponses<T = unknown> {
  success: boolean
  message?: string
  data?: T
  error?: ApiError
}

export type ApiOptions = RequestInit & {
  params?: Record<string, string | number | boolean>
}

export interface ApiThrownError extends Error {
  code?: string
  response?: ApiResponse<never>
}
