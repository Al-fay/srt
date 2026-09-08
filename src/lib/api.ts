import type { ApiOptions } from "@/types/api"
import { API_URL } from "./env"
import type ApiResponse from "@/types/api"

export async function api<T>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> {
  const { params, headers, ...fetchOptions } = options

  const url = new URL(`${API_URL}${endpoint}`)

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value))
    })
  }

  const isFormData = fetchOptions.body instanceof FormData

  const response = await fetch(url.toString(), {
    ...fetchOptions,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...headers,
    },
    credentials: "include",
  })

  const body = await response.json()

  if (!response.ok) {
    const error = new Error(
      body?.error?.message ?? body?.message ?? "Terjadi kesalahan"
    ) as Error & {
      code?: string
      response?: ApiResponse<never>
    }
    // console.log("API ERROR:", error)
    error.code = body?.error?.code
    error.response = body

    throw error
  }

  return body
}
