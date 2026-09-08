import type { SuratPengantarData } from "@/types/pengantar"

export const defaultPengantar: SuratPengantarData = {
  kantor: "",
  tanggal: new Date(),
  nomor: "",
  bagian: "",
  kode: "",
  bulan: "",
  tujuan: {
    tipe: "Internal",
    kantor: "",
    nama: "",
    jabatan: "",
  },
  pengirim: "",
  daftarBarangDokumen: [],
}
