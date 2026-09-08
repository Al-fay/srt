export interface TandaTangan {
  nip: string
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

export type SuratTugasCabMode = "create" | "edit"

export interface SuratTugasCabFormData {
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
