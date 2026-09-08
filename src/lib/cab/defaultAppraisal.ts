import type { AppraisalFormData } from "@/types/cab/appraisal"

export const defaultAppraisal: AppraisalFormData = {
  kantor: "",
  tanggal: new Date(),
  nomor: "",
  bagian: "",
  kode: "",
  bulan: "",
  kepada: "",
  alamat: "",
  jnsSertifikat: "",
  noSertifikat: "",
  luas: 0,
  atasNama: "",
  alamatSertifikat: "",
  ttd: [{ nip: "", jabatan: "" }],
}
