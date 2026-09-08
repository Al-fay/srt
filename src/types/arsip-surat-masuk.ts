export interface DataArsipSuratMasuk {
  id_surat: string
  no_surat: string
  id_kirim: string
  perihal: string
  tgl_share: Date
  stat_baca: string
}

export interface GetArsipSuratMasukParams {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortOrder?: "asc" | "desc"
  dateFrom?: string
  dateTo?: string
  filters?: Record<string, string>
}

export interface GetArsipSuratMasukResponse {
  success: boolean
  data: DataArsipSuratMasuk[]
  total: number
  page: number
  size: number
  timestamp: string
  error?: any
}
