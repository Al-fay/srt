import type { ComboboxOption } from "@/components/form/combobox-field";
import { api } from "@/lib/api";
import type ApiResponse from "@/types/api";

export interface DisplayUserKantor {
  xwil_code: string;
  xaktiv: string;
}

export interface DisplayUserGrup {
  xgrup: string;
}

export async function displayUserService(value: DisplayUserKantor) {
  return api<Blob>(`/auth/dfuser`, {
    method: "POST",
    body: JSON.stringify(value),
    headers: {
      "Content-Type": "application/json",
    },
    responseType: "blob",
  });
}

export async function displayUserGrupService(value: DisplayUserGrup) {
  return api<Blob>(`/auth/dfgrup`, {
    method: "POST",
    body: JSON.stringify(value),
    headers: {
      "Content-Type": "application/json",
    },
    responseType: "blob",
  });
}

export async function getJenisPenerima() {
  const response = await api<ApiResponse<ComboboxOption[]>>(
    "/surat/jenispenerima?xPil=2",
  );

  return response.data;
}
