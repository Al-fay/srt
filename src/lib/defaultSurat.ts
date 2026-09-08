import type { SuratFormData } from "@/types/surat";

export const defaultSurat: SuratFormData = {
  surat: {
    xKota: "",
    xNo_thn: new Date(),

    xNo_bag: "",
    xNo_kode: "",
    xNo_bln: "",

    xHal: "",
    kepada2: `KSPPS Kospin JASA Syariah
Di
     Tempat`,

    xIsi: "",
    ket_lampiran: "",

    klasifikasi: "",
    xTg_share: undefined,

    xKepada: [],
    tembusan_ket: [],

    jumlahLampiran: "",
  },

  ttd: [
    {
      Xidttd: "",
      jabatan: "",
    },
  ],

  lampiran: [],
};
