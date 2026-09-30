import type { ApiOptions } from "@/types/api";
import { API_URL } from "./env";
import type ApiResponse from "@/types/api";

export async function api<T>(
  endpoint: string,
  options: ApiOptions = {},
  _retried = false,
): Promise<T> {
  const { params, headers, responseType = "json", ...fetchOptions } = options;
  const url = new URL(`${API_URL}${endpoint}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });
  }

  const isFormData = fetchOptions.body instanceof FormData;

  const response = await fetch(url.toString(), {
    ...fetchOptions,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...headers,
    },
    credentials: "include",
  });

  if (!response.ok) {
    const contentType = response.headers.get("content-type") ?? "";

    let body: any = null;

    if (contentType.includes("application/json")) {
      body = await response.json();
    } else {
      body = await response.text();
    }

    if (response.status === 401 && !_retried && endpoint !== "/auth/refresh") {
      const refreshed = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });

      if (refreshed.ok) {
        return api<T>(endpoint, options, true);
      }
    }

    const error = new Error(
      body?.error?.message ?? body?.message ?? "Terjadi kesalahan",
    ) as Error & {
      code?: string;
      response?: ApiResponse<never>;
    };

    error.code = body?.error?.code;
    error.response = body;

    throw error;
  }

  if (responseType === "blob") {
    return (await response.blob()) as T;
  }

  return (await response.json()) as T;
}
