import { api } from "@/lib/api";
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
    method: "POST",
    params: queryParams,
  });

  return res;
}

export async function getArsipSuratKeluarReport(
  xid_surat: number,
  dif?: boolean,
) {
  return api<Blob>(`/surat-keluar/${xid_surat}?dif=${dif ? "true" : "false"}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    responseType: "blob",
  });
}
