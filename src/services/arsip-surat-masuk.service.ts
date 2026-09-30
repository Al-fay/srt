import { api } from "@/lib/api";
import type {
  GetArsipSuratMasukParams,
  GetArsipSuratMasukResponse,
} from "@/types/arsip-surat-masuk";

export async function getArsipSuratMasuk(
  params?: GetArsipSuratMasukParams,
): Promise<GetArsipSuratMasukResponse> {
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

  const res = await api<GetArsipSuratMasukResponse>("/surat-masuk", {
    method: "POST",
    params: queryParams,
  });

  return res;
}
