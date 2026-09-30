export interface Penerima {
  xPil: string;
  xPilValue: string;

  xTipe_penerima: string;
  xTipe_penerimaValue: string;
}

export interface TandaTangan {
  Xidttd: string | null;
  label?: string;
  jabatan: string;
}

export interface Surat {
  xNo_srt: string;
  xKota: string;
  xNo_thn: Date | undefined;

  xNo_bag: string;
  xNo_kode: string;
  xNo_bln: string;
  xHal: string;
  kepada2: string;
  // xTempat: string;
  ket_lampiran: string;
  xIsi: string;

  klasifikasi: string;
  xTg_share?: Date;

  xKepada: Penerima[];
  // tembusan: Penerima[];
  tembusan_ket: Tembusan[];

  jumlahLampiran: string;
}

export interface Dokumen {
  xlok_file?: string;
}

export interface Tembusan {
  tembusan_ket: string;
}

export interface SuratFormData {
  surat: Surat;
  ttd: TandaTangan[];
  dokumen?: Dokumen[];
  lampiran: File[];
}

export interface SaveSuratResult {
  IDsurat: number;
  kode?: string;
  ket?: string;
  no_surat: string;
}

export type SubmitResponse = {
  success: boolean;
  data?: {
    kode?: string;
    ket?: string;
  };
};

export type SuratType = "internal" | "eksternal";
export type SuratMode = "create" | "edit";
