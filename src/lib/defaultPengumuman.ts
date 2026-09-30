import type { PengumumanLiburFormData } from "@/types/libur";

export const defaultPengumuman: PengumumanLiburFormData = {
  xNo_thn: new Date(),
  nomor: "",
  xNo_bag: "",
  xNo_kode: "",
  xNo_bln: "",
  tglLibur: [],
  buka: new Date(),
  ttd: [
    {
      Xidttd: "",
      jabatan: "",
    },
  ],
  klasifikasi: "",
  xTg_share: undefined,
};
