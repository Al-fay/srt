export interface TandaTangan {
  nip: string
  jabatan: string
}

export interface PemberitahuanPenolakanFormData {
  kantor: string
  tanggal: Date | undefined
  nomor: string
  bagian: string
  kode: string
  bulan: string
  perihal: string
  nama: string
  panggilan: string
  alamat: string
  tglPermohonan: Date | undefined
  nominal: number
  ttd: TandaTangan[]
  klasifikasi: string
}

export type PemberitahuanPenolakanMode = "create" | "edit"
