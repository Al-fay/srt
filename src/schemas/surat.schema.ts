import { z } from "zod"

export const penerimaSchema = z.object({
  bagian: z.string().min(1, "Bagian wajib dipilih"),
  jabatan: z.string().min(1, "Jabatan wajib dipilih"),
  media: z.string().min(1, "Media wajib dipilih"),
})

export const tandaTanganSchema = z.object({
  nip: z.string().min(1, "NIP wajib dipilih"),
  jabatan: z.string().min(1, "Jabatan wajib diisi"),
})

export const suratSchema = z.object({
  kantor: z.string().min(1, "Kantor wajib dipilih"),
  tanggal: z.date(),
  nomor: z.string().min(1, "Nomor wajib diisi"),
  bagian: z.string().min(1, "Bagian wajib dipilih"),
  kode: z.string().min(1, "Kode wajib dipilih"),
  bulan: z.string().min(1, "Bulan wajib dipilih"),
  perihal: z.string().min(1, "Perihal wajib diisi"),
  // alamat: z.string().min(1, "Alamat wajib diisi"),
  isi: z.string().min(1, "Isi wajib diisi"),
  penutup: z.string(),
  klasifikasi: z.string().min(1, "Klasifikasi wajib diisi"),
  kepada: z.array(penerimaSchema).min(1, "Kepada wajib diisi"),
  tembusan: z.array(penerimaSchema),
  jumlahLampiran: z.string(),
  lampiran: z.array(z.instanceof(File)),
  ttd: z
    .array(tandaTanganSchema)
    .min(1, "Tanda tangan minimal 1")
    .max(3, "Tanda tangan maksimal 3"),
})

export type SuratSchema = z.infer<typeof suratSchema>
