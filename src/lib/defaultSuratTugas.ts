import type {
  SuratTugasDriverFormData,
  SuratTugasFormData,
} from "@/types/tugas"

export const defaultSuratTugas: SuratTugasFormData = {
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

export const defaultSuratTugasDriver: SuratTugasDriverFormData = {
  kantor: "",
  tanggal: new Date(),
  pemberiTugas: "",
  jabatan: "",
  namaDriver: "",
  tglTugas: new Date(),
  jamTugas: "",
  tujuan: "",
  keperluan: "",
  noPol: "",
  keterangan: "",
  klasifikasi: "",
}
