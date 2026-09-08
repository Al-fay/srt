import type { ComboboxOption } from "@/components/form/combobox-field"
import { api } from "@/lib/api"
import { API_URL } from "@/lib/env"
import type ApiResponse from "@/types/api"

export interface DisplayUserKantor {
  xwil_code: string
  xaktiv: string
}

export interface DisplayUserGrup {
  xgrup: string
}

export async function displayUserService(value: DisplayUserKantor) {
  const response = await fetch(`${API_URL}/auth/dfuser`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(value),
  })

  const contentType = response.headers.get("content-type") ?? ""

  if (!response.ok) {
    let body: any = null

    if (contentType.includes("application/json")) {
      body = await response.json()
    } else {
      body = await response.text()
    }

    const error = new Error(
      body?.error?.message ?? body?.message ?? "Terjadi kesalahan"
    ) as Error & {
      code?: string
      response?: ApiResponse<never>
    }

    error.code = body?.error?.code
    error.response = body

    throw error
  }

  return response.blob()
}

export async function displayUserGrupService(value: DisplayUserGrup) {
  const response = await fetch(`${API_URL}/auth/dfgrup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(value),
  })

  const contentType = response.headers.get("content-type") ?? ""

  if (!response.ok) {
    let body: any = null

    if (contentType.includes("application/json")) {
      body = await response.json()
    } else {
      body = await response.text()
    }

    const error = new Error(
      body?.error?.message ?? body?.message ?? "Terjadi kesalahan"
    ) as Error & {
      code?: string
      response?: ApiResponse<never>
    }

    error.code = body?.error?.code
    error.response = body

    throw error
  }

  return response.blob()
}

export async function getJenisPenerima() {
  const response = await api<ApiResponse<ComboboxOption[]>>(
    "/surat/jenispenerima?xPil=2"
  )

  return response.data
}
