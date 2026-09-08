import type { PengumumanLiburFormData } from "@/types/libur"

export const defaultPengumuman: PengumumanLiburFormData = {
  tanggal: new Date(),
  nomor: "",
  bagian: "",
  kode: "",
  bulan: "",
  tglLibur: [],
  buka: new Date(),
  ttd: [{ nip: "", jabatan: "" }],
}
