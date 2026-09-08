export interface TandaTangan {
  nip: string
  jabatan: string
}

export interface Penerima {
  bagian: string
  jabatan: string
  media: string
}

export interface PanggotaFormData {
  kantor: string
  tanggal: Date | undefined
  nomor: string
  bagian: string
  kode: string
  bulan: string
  nama: string
  alamat: string
  panggilan: string
  tglPanggilan: Date | undefined
  jam: string
  tempat: string
  acara: string
  ttd: TandaTangan[]
  tembusan: Penerima[]
}

export type PanggotalMode = "create" | "edit"
