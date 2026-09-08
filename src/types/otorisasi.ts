export interface AllDataOtorisasi {
  nip: string
  id_kirim: string
  id_surat: number
  no_surat: string
  perihal: string
  kepada: string
  tgl_kirim: string
  lampiran: string
  oto: number
}

export interface GetOtorisasisResponse {
  success: boolean
  data: AllDataOtorisasi[]
  total: number
  page: number
  size: number
  timestamp: string
  error?: any
}
