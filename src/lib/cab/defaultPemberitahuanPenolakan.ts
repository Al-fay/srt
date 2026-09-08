import type { PemberitahuanPenolakanFormData } from "@/types/cab/ppenolakan"

export const defaultPemberitahuanPenolakan: PemberitahuanPenolakanFormData = {
  kantor: "",
  tanggal: new Date(),
  nomor: "",
  bagian: "",
  kode: "",
  bulan: "",
  perihal: "",
  nama: "",
  panggilan: "",
  alamat: "",
  tglPermohonan: new Date(),
  nominal: 0,
  ttd: [{ nip: "", jabatan: "" }],
  klasifikasi: "",
}
