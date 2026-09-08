import { api } from "@/lib/api";
import { API_URL } from "@/lib/env";
import type ApiResponse from "@/types/api";
import type {
  GetArsipSuratKeluarParams,
  GetArsipSuratKeluarResponse,
} from "@/types/arsip-surat-keluar";

export async function getArsipSuratKeluar(
  params?: GetArsipSuratKeluarParams,
): Promise<GetArsipSuratKeluarResponse> {
  const queryParams: Record<string, string | number | boolean> = {};

  if (params?.page !== undefined) {
    queryParams.page = params.page;
  }

  if (params?.limit !== undefined) {
    queryParams.size = params.limit;
  }

  if (params?.search) {
    queryParams.search = params.search;
  }

  if (params?.sortBy) {
    queryParams.sortBy = params.sortBy;
  }

  if (params?.sortOrder) {
    queryParams.sortOrder = params.sortOrder;
  }

  if (params?.dateFrom) {
    queryParams.dateFrom = params.dateFrom;
  }

  if (params?.dateTo) {
    queryParams.dateTo = params.dateTo;
  }

  if (params?.filters) {
    Object.entries(params.filters).forEach(([k, v]) => {
      if (v) {
        queryParams[k] = v;
      }
    });
  }

  const res = await api<GetArsipSuratKeluarResponse>("/surat-keluar", {
    params: queryParams,
  });

  return res;
}

export async function getArsipSuratKeluarReport(xid_surat: number) {
  const response = await fetch(`${API_URL}/surat-keluar/${xid_surat}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  const contentType = response.headers.get("content-type") ?? "";

  if (!response.ok) {
    let body: any = null;

    if (contentType.includes("application/json")) {
      body = await response.json();
    } else {
      body = await response.text();
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

  return response.blob();
}
