import type { TandaTangan } from "./surat";

export interface TanggalLibur {
  tglLibur: Date;
  keterangan: string;
}

export interface PengumumanLiburFormData {
  xNo_thn: Date;
  nomor: string;
  xNo_bag: string;
  xNo_kode: string;
  xNo_bln: string;
  tglLibur: TanggalLibur[];
  buka: Date;
  ttd: TandaTangan[];
  klasifikasi: string;
  xTg_share?: Date;
}

export type PengumumanLiburMode = "create" | "edit";
