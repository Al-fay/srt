import {
  getBagianOptions,
  getBentuk,
  getBulanOptions,
  getDitujukanOptions,
  getKendaraanOptions,
  getKlasifikasiOptions,
  getKodeOptions,
  getPanggilan,
  getPeringkat,
  getSertifikat,
  getSertifikatAppraisal,
  getTujuanOptions,
} from "@/services/options.service"
import { useQuery } from "@tanstack/react-query"

export function useBulanOptions() {
  return useQuery({
    queryKey: ["bulan-options"],
    queryFn: getBulanOptions,
    staleTime: Infinity,
  })
}

export function useKodeOptions() {
  return useQuery({
    queryKey: ["kode-options"],
    queryFn: getKodeOptions,
    staleTime: Infinity,
  })
}

export function useKlasifikasiOptions() {
  return useQuery({
    queryKey: ["klasifikasi-options"],
    queryFn: getKlasifikasiOptions,
    staleTime: Infinity,
  })
}

export function useKendaraanOptions() {
  return useQuery({
    queryKey: ["kendaraan-options"],
    queryFn: getKendaraanOptions,
    staleTime: Infinity,
  })
}

export function useTujuanOptions() {
  return useQuery({
    queryKey: ["tujuan-options"],
    queryFn: getTujuanOptions,
    staleTime: Infinity,
  })
}

export function useDitujukanOptions() {
  return useQuery({
    queryKey: ["ditujukan-options"],
    queryFn: getDitujukanOptions,
    staleTime: Infinity,
  })
}

export function usePanggilanOptions() {
  return useQuery({
    queryKey: ["panggilan-options"],
    queryFn: getPanggilan,
    staleTime: Infinity,
  })
}

export function useBentukOptions() {
  return useQuery({
    queryKey: ["bentuk-options"],
    queryFn: getBentuk,
    staleTime: Infinity,
  })
}

export function useSertifikatOptions() {
  return useQuery({
    queryKey: ["sertifikat-options"],
    queryFn: getSertifikat,
    staleTime: Infinity,
  })
}

export function usePeringkatOptions() {
  return useQuery({
    queryKey: ["peringkat-options"],
    queryFn: getPeringkat,
    staleTime: Infinity,
  })
}

export function useAppraisalOptions() {
  return useQuery({
    queryKey: ["appraisal-options"],
    queryFn: getSertifikatAppraisal,
    staleTime: Infinity,
  })
}

export function useBagianSuratOptions() {
  return useQuery({
    queryKey: ["bagian-options"],
    queryFn: getBagianOptions,
    staleTime: Infinity,
  })
}
