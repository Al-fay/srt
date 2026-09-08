import type { InternalCabFormData } from "@/types/cab/internalcab"

export const defaultInternalCab: InternalCabFormData = {
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
