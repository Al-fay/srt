import { api } from "@/lib/api";
import { encrypt } from "@/lib/crypto";
import type ApiResponse from "@/types/api";
import type { SaveSuratResult, SuratFormData } from "@/types/surat";
import { getKotaOptions } from "./options.service";

export interface DataSurat {
  xNo_bag?: string;
  xNo_kode?: string;
  xNo_bln?: string;
  xNo_thn?: string;
  xHal?: string;
  xKepada?: string;
  xIsi: string;
  xJml_ttd?: number;
  xLampiran?: number;
  xTg_share?: Date;
  xKlasifikasi?: number;
  xKota?: string;
  xWill?: string;
}

export interface UploadLampiranResult {
  success: boolean;
  message: string;
  data: {
    xlok_file: string;
  }[];
}

export async function uploadLampiran(xid_surat: number, files: File[]) {
  const formData = new FormData();

  formData.append("xid_surat", xid_surat.toString());

  files.forEach((file) => {
    formData.append("files", file);
  });

  return api("/surat/lampiran", {
    method: "POST",
    body: formData,
  });
}

export async function createSuratInternal(value: SuratFormData) {
  const jumlahTTD = value.ttd.filter((item) => item.Xidttd?.trim()).length;

  const kotaOptions = await getKotaOptions();

  const namaKota = kotaOptions.find(
    (item) => item.value === value.surat.xKota,
  )?.label;

  const payload = encrypt({
    surat: {
      xNo_srt: value.surat.xNo_srt,
      xNo_bag: value.surat.xNo_bag,
      xNo_kode: value.surat.xNo_kode,
      xNo_bln: value.surat.xNo_bln,
      xNo_thn: value.surat.xNo_thn?.getFullYear().toString(),
      xHal: value.surat.xHal,

      xKepada: value.surat.xKepada
        .map((item) => item.xTipe_penerimaValue)
        .join(", "),

      kepada2: value.surat.kepada2,

      xIsi: value.surat.xIsi,
      xJml_ttd: jumlahTTD,
      xLampiran: Number(value.surat.jumlahLampiran),
      ket_lampiran: value.surat.ket_lampiran,
      xTg_share: value.surat.xTg_share
        ? value.surat.xTg_share.toISOString().slice(0, 10)
        : null,

      xKlasifikasi: Number(value.surat.klasifikasi),
      xKota: namaKota,
      tembusan_ket: value.surat.tembusan_ket
        .map((item) => item.tembusan_ket)
        .join(", "),
    },

    ttd:
      value.ttd
        ?.filter((item) => item.Xidttd?.trim())
        .map((item, index) => ({
          Xidttd: item.Xidttd,
          Xurut: index + 1,
        })) ?? [],

    penerima: [
      ...value.surat.xKepada.map((item) => ({
        Xpenerima: Number(item.xPil) === 1 ? item.xTipe_penerimaValue : "",
        Xjns_penerima: 1,
        xTipe_penerima: Number(item.xPil),
        xKode_grup: Number(item.xPil) === 1 ? 0 : Number(item.xTipe_penerima),
      })),

      // ...value.surat.tembusan.map((item) => ({
      //   Xpenerima: Number(item.xPil) === 1 ? item.xTipe_penerimaValue : "",
      //   Xjns_penerima: 2,
      //   xTipe_penerima: Number(item.xPil),
      //   xKode_grup: Number(item.xPil) === 1 ? 0 : Number(item.xTipe_penerima),
      // })),
    ],
  });

  // console.log("ini payload surat : ", payload);

  const suratResult = await api<ApiResponse<SaveSuratResult>>("/surat", {
    method: "POST",
    body: JSON.stringify({ payload }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (suratResult.data.kode === "xx") {
    const message =
      suratResult.data.ket ??
      "Nomor surat sudah terdaftar, silakan gunakan nomor lain";

    throw new Error(message);
  }

  const xid_surat = suratResult.data.IDsurat;

  if (value.lampiran.length > 0) {
    const uploadResult = await uploadLampiran(xid_surat, value.lampiran);

    console.log("UPLOAD:", uploadResult);
  }

  return suratResult;
}
