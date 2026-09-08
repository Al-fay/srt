export type TujuanSurat =
  | {
      tipe: "Internal"
      kantor: string
      nama: string
      jabatan: string
    }
  | {
      tipe: "Eksternal"
      nama: string
      jabatan: string
      alamat: string
    }

export interface BarangDokumen {
  nama: string
  qty: string
  keterangan?: string
}

export interface SuratPengantarData {
  kantor: string
  tanggal: Date
  nomor: string
  bagian: string
  kode: string
  bulan: string
  tujuan: TujuanSurat
  pengirim: string
  daftarBarangDokumen: BarangDokumen[]
}

export type SuratPengantarMode = "create" | "edit"
