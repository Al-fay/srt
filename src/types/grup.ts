export interface DataBag {
  kode_bag: string;
  ket: string;
  level_bag: number;
  grup: number;
  ket_grup: string;
}

export interface DataBagianGrup {
  grup: number;
  ket_grup: string;
}

export interface GetDataBagResponse {
  success: boolean;
  data: DataBag[];
  total: number;
  page: number;
  size: number;
  timestamp: string;
  error?: any;
}

export interface GetDataBagianGrupResponse {
  success: boolean;
  data: DataBagianGrup[];
  total: number;
  page: number;
  size: number;
  timestamp: string;
  error?: any;
}

export type BagianGrupType = "create" | "edit";

export interface BagianGrupForm {
  xpil?: number;
  xkd_grup: number;
  xket_grup: string;
}

export interface BagianForm {
  xpil?: number;
  xkode_bag: string;
  xket: string;
  xgrup: string;
}
