export type UserMode = "create" | "edit"

export interface AllDataUser {
  pass_id: string
  pass_name: string
  bagian: string
  ket: string
  wil_code: string
  wil_ket: string
  nohp: string
  aktiv: number
}

export interface GetUsersResponse {
  success: boolean
  data: AllDataUser[]
  total: number
  page: number
  size: number
  timestamp: string
  error?: any
}

export interface UserFormData {
  xpass_id: string
  xpass_name: string
  // xpass_wd: string
  xbagian: string
  xwil_code: string
  xnip: string
  xnohp: string
}

export interface LoginForm {
  xpass_id: string
  xpass_wd: string
}

export interface SignInResponse {
  success: boolean
  data: {
    kode: string
    [key: string]: any
  }
  timestamp: string
  error?: any
}

export interface MeResponse {
  success: boolean
  data: {
    pass_id: string
    pass_name: string
    nip: string
    bagian: string
    nohp: string
    aktiv: string
    ttd: string | null
    ket: string
    kode: string
    wil_code: string
    wil_ket: string
    kota: string
    lv_user: string
  }
  timestamp: string
}

export interface changePasswordForm {
  xpil: number
  xpass_id: string
  xpass_wd: string
  xcpass_wd: string
}

export interface DataAktivasi {
  xpass_id: string
  xpass_wd: string
  xcpass_wd: string
  xbagian: string
  xnip: string
  xnohp: string
}

export interface ResetPassword {
  xpass_id: string
}

export interface UpdateUser {
  xpass_id: string
  xpass_wd?: string
  xcpass_wd?: string
  xpass_name?: string
  xbagian?: string
  xnip?: string
  xnohp?: string
  lv_user?: string
  aktiv?: number
  xpil: number
}

export type UpdateUserResponse = {
  success: boolean
  data: any
  message?: string
  timestamp: string
}
