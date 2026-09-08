export type RoyaMode = "create" | "edit"

export interface TandaTangan {
  nip: string
  jabatan: string
}

export interface RoyaFormData {
  kantor: string
  tanggal: Date | undefined
  nomor: string
  bagian: string
  kode: string
  bulan: string
  peringkatHT: string
  bpnKota: string
  noAkta: string
  tglAkta: string
  notaris: string
  bentuk: string
  sertifikat: string
  noSertifikat: string
  luas: string
  noSuratUkur: string
  tglTerbit: Date | undefined
  atasnama: string
  kelurahan: string
  kecamatan: string
  kota: string
  provinsi: string
  noSHT: string
  tglHT: Date | undefined
  ttd: TandaTangan[]
}
