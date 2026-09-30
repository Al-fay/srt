import type { DataTableQueryParams } from "@/components/data-table";
import { api } from "@/lib/api";
import { encrypt } from "@/lib/crypto";
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
    Object.entries(params.filters).forEach(([key, value]) => {
      if (value) {
        queryParams[key] = value;
      }
    });
  }

  return api<GetOtorisasisResponse>("/otorisasi", {
    method: "POST",
    params: queryParams,
  });
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

  return api<ApiResponse>("/otorisasi", {
    method: "PATCH",
    body: JSON.stringify({ payload }),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function getPreviewSuratOto(
  xid_surat: number,
  dif?: boolean,
): Promise<Blob> {
  return api<Blob>(`/otorisasi/${xid_surat}?dif=${dif ? "true" : "false"}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    responseType: "blob",
  });
}

export async function getPreviewSuratMasuk(
  xid_surat: number,
  dif?: boolean,
): Promise<Blob> {
  return api<Blob>(`/otorisasi/sm/${xid_surat}?dif=${dif ? "true" : "false"}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    responseType: "blob",
  });
}
