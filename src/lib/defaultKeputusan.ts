import type { SuratKeputusanFormData } from "@/types/keputusan"

export const defaultKeputusan: SuratKeputusanFormData = {
  tanggal: new Date(),
  nomor: "",
  bagian: "",
  kode: "",
  bulan: "",
  tentang: "",
  ditunjukan: {
    type: "",
    nama: "",
  },
  menimbang: [],
  mengingat: [],
  isi: "",
  ttd: [],
  mengetahui: [],
  klasifikasi: "",
}
