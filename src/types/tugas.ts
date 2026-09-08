export interface TandaTangan {
  bulan: string
  jabatan: string
}

export interface PenerimaTugas {
  nip: string
  nama: string
}

export interface Penerima {
  bagian: string
  jabatan: string
  media: string
}

export type SuratTugasMode = "create" | "edit"
export type SuratTugasType = "umum" | "driver"

export interface SuratTugasFormData {
  kantor: string
  tanggal: Date | undefined
  nomor: string
  bagian: string
  kode: string
  bulan: string
  pemberiTugas: string
  penerimaTugas: PenerimaTugas[]
  ditugaskanKe: string
  tglPenugasan: Date | undefined
  pukul: string
  acara: string
  kendaraan: string
  klasifikasi: string
  tembusan: Penerima[]
  ttd: TandaTangan[]
}

export interface SuratTugasDriverFormData {
  kantor: string
  tanggal: Date | undefined
  pemberiTugas: string
  jabatan: string
  namaDriver: string
  tglTugas: Date | undefined
  jamTugas: string
  tujuan: string
  keperluan: string
  noPol: string
  keterangan?: string
  klasifikasi: string
}
