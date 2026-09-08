import type { MemoFormData } from "@/types/memo"

export const defaultMemo: MemoFormData = {
  kantor: "",
  tanggal: new Date(),
  nomor: "",
  bagian: "",
  kode: "",
  bulan: "",
  memoDari: "",
  ttd: [],
  penerima: [],
  perihal: "",
  isi: "",
  klasifikasi: "",
  lampiran: [],
}
