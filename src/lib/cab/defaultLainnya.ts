import type { LainnyaFormData } from "@/types/cab/lainnya"

export const defaultLainnya: LainnyaFormData = {
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
