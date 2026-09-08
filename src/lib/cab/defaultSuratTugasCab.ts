import type { SuratTugasCabFormData } from "@/types/cab/tugas"

export const defaultSuratTugasCab: SuratTugasCabFormData = {
  kantor: "",
  tanggal: new Date(),
  nomor: "",
  bagian: "",
  kode: "",
  bulan: "",
  pemberiTugas: "",
  penerimaTugas: [],
  ditugaskanKe: "",
  tglPenugasan: new Date(),
  pukul: "",
  acara: "",
  kendaraan: "",
  klasifikasi: "",
  tembusan: [],
  ttd: [],
}
