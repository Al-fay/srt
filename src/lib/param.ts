import type ApiResponse from "@/types/api";
import { api } from "@/lib/api";

export const klasifikasiMap: Record<number, string> = {
  1: "Rahasia",
  2: "Internal Bagian",
  3: "Internal Kantor",
  4: "Publik",
};

export async function getLokasi() {
  const respones = await api<ApiResponse>("/utilitas/lokasi");

  return respones.data;
}
