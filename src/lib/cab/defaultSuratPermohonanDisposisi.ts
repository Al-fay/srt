import type { PermohonanDisposisiFormData } from "@/types/cab/pdisposisi"

export const defaultSuratPermohonanDisposisi: PermohonanDisposisiFormData = {
  kantor: "",
  tanggal: new Date(),
  nomor: "",
  bagian: "",
  kode: "",
  bulan: "",
  perihal: "",
  alamat: "",
  isi: "",
  penutup: "",
  klasifikasi: "",
  jumlahLampiran: "",
  mengetahui: {
    mengetahui: "tidak",
    bagian: "",
    jabatan: "",
  },
  kepada: [],
  tembusan: [],
  lampiran: [],
  ttd: [{ nip: "", jabatan: "" }],
}
