export interface TanggalLibur {
  tglLibur: Date
  keterangan: string
}

export interface TandaTangan {
  nip: string
  jabatan: string
}

export interface PengumumanLiburFormData {
  tanggal: Date
  nomor: string
  bagian: string
  kode: string
  bulan: string
  tglLibur: TanggalLibur[]
  buka: Date
  ttd: TandaTangan[]
}

export type PengumumanLiburMode = "create" | "edit"
