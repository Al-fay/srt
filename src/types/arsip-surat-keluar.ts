export interface DataArsipSuratKeluar {
  id_surat: string
  no_surat: string
  perihal: string
  kepada: string
  stat_oto: string
  tgl_kirim: Date
}

export interface GetArsipSuratKeluarParams {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortOrder?: "asc" | "desc"
  dateFrom?: string
  dateTo?: string
  filters?: Record<string, string>
}

export interface GetArsipSuratKeluarResponse {
  success: boolean
  data: DataArsipSuratKeluar[]
  total: number
  page: number
  size: number
  timestamp: string
  error?: any
}

export interface GetArsipSuratKeluarByIdResponse {
  id_surat: number
  no_surat: string
  perihal: string
  wil_kirim: string
  kota: string
  tgl_kirim: Date
  kepada: string
  isi: string
  stat_oto: string
  lampiran: number
  klasifikasi: string
  urut: number
  id_ttd: string
  oto: number
  ttd_name: string
  ttd_image: string
  ket: string
  ttd: [
    urut: number,
    id_ttd: string,
    ttd_name: string,
    ket: string,
    ttd_image: string,
  ]
}
