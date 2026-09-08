export type KeputusanType = "produk" | "nonproduk"
export type KeputusanMode = "create" | "edit"

export interface TandaTangan {
  nip: string
  jabatan: string
}

export interface Ditujukan {
  type: string
  nama: string
}

export interface SuratKeputusanFormData {
  tanggal: Date
  nomor: string
  bagian: string
  kode: string
  bulan: string
  tentang: string
  ditunjukan?: Ditujukan
  menimbang: string[]
  mengingat: string[]
  isi: string
  ttd: TandaTangan[]
  mengetahui: TandaTangan[]
  klasifikasi: string
}
