import type { DataTableQueryParams } from "@/components/data-table";
import { api } from "@/lib/api";
import { encrypt } from "@/lib/crypto";
import type {
  BagianForm,
  BagianGrupForm,
  GetDataBagianGrupResponse,
  GetDataBagResponse,
} from "@/types/grup";

export async function getDataBag(
  params?: Partial<DataTableQueryParams>,
): Promise<GetDataBagResponse> {
  const queryParams: Record<string, string | number | boolean> = {};

  if (params?.page !== undefined) queryParams.page = params.page;
  if (params?.limit !== undefined) queryParams.size = params.limit;
  if (params?.search) queryParams.search = params.search;

  if (params?.filters) {
    Object.entries(params.filters).forEach(([k, v]) => {
      if (v) queryParams[k] = v;
    });
  }

  const res = await api<GetDataBagResponse>("/bagian/gb", {
    method: "POST",
    params: queryParams,
  });

  return res;
}

export async function getDataGrupBag(
  params?: Partial<DataTableQueryParams>,
): Promise<GetDataBagianGrupResponse> {
  const queryParams: Record<string, string | number | boolean> = {};

  if (params?.page !== undefined) queryParams.page = params.page;
  if (params?.limit !== undefined) queryParams.size = params.limit;
  if (params?.search) queryParams.search = params.search;

  if (params?.filters) {
    Object.entries(params.filters).forEach(([k, v]) => {
      if (v) queryParams[k] = v;
    });
  }

  const res = await api<GetDataBagianGrupResponse>("/bagian", {
    method: "POST",
    params: queryParams,
  });

  return res;
}

export async function saveBagian(value: BagianForm) {
  const payload = encrypt({
    xpil: 1,
    xkode_bag: value.xkode_bag,
    xket: value.xket,
    xgrup: Number(value.xgrup),
  });

  return api("/bagian/b", {
    method: "POST",
    body: JSON.stringify({ payload }),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function saveBagianGrup(value: BagianGrupForm) {
  const payload = encrypt({
    xpil: 1,
    xkd_grup: value.xkd_grup,
    xket_grup: value.xket_grup,
  });

  return api("/bagian/bg", {
    method: "POST",
    body: JSON.stringify({ payload }),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function updateBagianGrup(value: BagianGrupForm) {
  const payload = encrypt({
    xpil: 2,
    xkd_grup: value.xkd_grup,
    xket_grup: value.xket_grup,
  });

  return api("/bagian/bg", {
    method: "POST",
    body: JSON.stringify({ payload }),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function updateBagian(value: BagianForm) {
  const payload = encrypt({
    xpil: 2,
    xkode_bag: value.xkode_bag,
    xket: value.xket,
    xgrup: value.xgrup,
  });

  return api("/bagian/b", {
    method: "POST",
    body: JSON.stringify({ payload }),
    headers: {
      "Content-Type": "application/json",
    },
  });
}
