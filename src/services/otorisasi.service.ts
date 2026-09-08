import type { DataTableQueryParams } from "@/components/data-table";
import { api } from "@/lib/api";
import { encrypt } from "@/lib/crypto";
import { API_URL } from "@/lib/env";
import type ApiResponse from "@/types/api";
import type { GetOtorisasisResponse } from "@/types/otorisasi";

export interface SaveOtorisasi {
  Xid_surat: number;
  Xno_surat: string;
}

export async function getOtorisasi(
  params?: Partial<DataTableQueryParams>,
): Promise<GetOtorisasisResponse> {
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

  if (params?.filters) {
    Object.entries(params.filters).forEach(([k, v]) => {
      if (v) {
        queryParams[k] = v;
      }
    });
  }

  const res = await api<GetOtorisasisResponse>("/otorisasi", {
    params: queryParams,
  });

  return res;
}

export async function saveOtorisasi(
  value: SaveOtorisasi,
): Promise<ApiResponse> {
  const payload = encrypt([
    {
      Xid_surat: value.Xid_surat,
      Xno_surat: value.Xno_surat,
    },
  ]);

  // console.log("Payload:", payload)

  return api<ApiResponse>("/otorisasi", {
    method: "PATCH",
    body: JSON.stringify({ payload }),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function getPreviewSuratOto(xid_surat: number) {
  const response = await fetch(`${API_URL}/otorisasi/${xid_surat}`, {
    method: "GET",
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

export async function getPreviewSuratMasuk(xid_surat: number) {
  const response = await fetch(`${API_URL}/otorisasi/sm/${xid_surat}`, {
    method: "GET",
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
