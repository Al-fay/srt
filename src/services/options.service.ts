import type { ComboboxOption } from "@/components/form/combobox-field";
import { api } from "@/lib/api";
import type ApiResponse from "@/types/api";

export async function getBulanOptions() {
  const response = await api<ApiResponse<ComboboxOption[]>>("/param/months");

  return response.data;
}

export async function getKodeOptions() {
  const response = await api<ApiResponse<ComboboxOption[]>>("/param/codes");

  return response.data;
}

export async function getKlasifikasiOptions() {
  const response =
    await api<ApiResponse<ComboboxOption[]>>("/param/klasifikasi");

  return response.data;
}

export async function getKendaraanOptions() {
  const response = await api<ApiResponse<ComboboxOption[]>>("/param/kendaraan");

  return response.data;
}

export async function getTujuanOptions() {
  const response = await api<ApiResponse<ComboboxOption[]>>("/param/tujuan");

  return response.data;
}

export async function getDitujukanOptions() {
  const response = await api<ApiResponse<ComboboxOption[]>>("/param/ditujukan");

  return response.data;
}

export async function getPanggilan() {
  const response = await api<ApiResponse<ComboboxOption[]>>("/param/panggilan");

  return response.data;
}

export async function getBentuk() {
  const response = await api<ApiResponse<ComboboxOption[]>>("/param/bentuk");

  return response.data;
}

export async function getSertifikat() {
  const response =
    await api<ApiResponse<ComboboxOption[]>>("/param/sertifikat");

  return response.data;
}

export async function getPeringkat() {
  const response = await api<ApiResponse<ComboboxOption[]>>("/param/peringkat");

  return response.data;
}

export async function getSertifikatAppraisal() {
  const response = await api<ApiResponse<ComboboxOption[]>>("/param/appraisal");

  return response.data;
}

export async function getBagianOptions() {
  const response =
    await api<ApiResponse<ComboboxOption[]>>("/param/bagiansurat");

  return response.data;
}

export async function getKantorOptions() {
  const response = await api<ApiResponse<ComboboxOption[]>>("/param/kantor");

  return response.data;
}

export async function getKepada2Options() {
  const response = await api<ApiResponse<ComboboxOption[]>>(
    "/surat/jenispenerima",
  );

  return response.data;
}

export async function getBagianUserOptions() {
  const response = await api<ApiResponse<ComboboxOption[]>>("/param/bagian");

  return response.data;
}

export async function getWilCodeOptions() {
  const response = await api<ApiResponse<ComboboxOption[]>>("/param/wilcode");

  return response.data;
}

export async function getKotaOptions() {
  const response = await api<ApiResponse<ComboboxOption[]>>("/param/kota");

  return response.data;
}

export async function getLevelUserOptions() {
  const response = await api<ApiResponse<ComboboxOption[]>>("/param/level");

  return response.data;
}

export async function getXpilOptions() {
  const response = await api<ApiResponse<ComboboxOption[]>>("/param/xpil");

  return response.data;
}

export async function getStsUserOptions() {
  const response = await api<ApiResponse<ComboboxOption[]>>("/param/stsuser");

  return response.data;
}

export async function getSatuanOptions() {
  const response = await api<ApiResponse<ComboboxOption[]>>("/param/satuan");

  return response.data;
}
