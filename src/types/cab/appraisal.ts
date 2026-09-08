export interface TandaTangan {
  nip: string
  jabatan: string
}

export interface AppraisalFormData {
  kantor: string
  tanggal: Date | undefined
  nomor: string
  bagian: string
  kode: string
  bulan: string
  kepada: string
  alamat: string
  jnsSertifikat: string
  noSertifikat: string
  luas: number
  atasNama: string
  alamatSertifikat: string
  ttd: TandaTangan[]
}

export type AppraisalMode = "create" | "edit"
