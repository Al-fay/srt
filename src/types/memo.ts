export interface TandaTangan {
  nip: string
  jabatan: string
}

export interface Penerima {
  nip: string
  nama: string
}

export interface MemoFormData {
  kantor: string
  tanggal: Date
  nomor: string
  bagian: string
  kode: string
  bulan: string
  memoDari: string
  ttd: TandaTangan[]
  penerima: Penerima[]
  perihal: string
  isi: string
  klasifikasi: string
  lampiran: File[]
}

export type MemoMode = "create" | "edit"
