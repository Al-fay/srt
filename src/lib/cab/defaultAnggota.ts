import type { PanggotaFormData } from "@/types/cab/panggota"

export const defaultAnggota: PanggotaFormData = {
  kantor: "",
  tanggal: new Date(),
  nomor: "",
  bagian: "",
  kode: "",
  bulan: "",
  nama: "",
  alamat: "",
  panggilan: "",
  tglPanggilan: new Date(),
  jam: "",
  tempat: "",
  acara: "",
  ttd: [{ nip: "", jabatan: "" }],
  tembusan: [{ bagian: "", jabatan: "", media: "" }],
}
