export interface TandaTangan {
  nip: string
  jabatan: string
}

export interface Penerima {
  bagian: string
  jabatan: string
  media: string
}

type MengetahuiValue = {
  mengetahui: "ada" | "tidak"
  bagian: string
  jabatan: string
}

export interface InternalCabFormData {
  kantor: string
  tanggal: Date | undefined
  nomor: string
  bagian: string
  kode: string
  bulan: string
  perihal: string
  alamat: string
  isi: string
  penutup: string
  klasifikasi: string
  mengetahui: MengetahuiValue
  kepada: Penerima[]
  tembusan: Penerima[]
  jumlahLampiran: string
  lampiran: File[]
  ttd: TandaTangan[]
}

export type InternalCabMode = "create" | "edit"
