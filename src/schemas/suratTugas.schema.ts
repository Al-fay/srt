import z from "zod"

export const penerimaTugasSchema = z.object({
  nip: z.string().min(1, "NIP wajib diisi"),
  nama: z.string().min(1, "Nama wajib diisi"),
})

export const penerimaSchema = z.object({
  bagian: z.string().min(1, "Bagian wajib dipilih"),
  jabatan: z.string().min(1, "Jabatan wajib dipilih"),
  media: z.string().min(1, "Media wajib dipilih"),
})

export const tandaTanganSchema = z.object({
  bulan: z.string().min(1, "Bulan wajib dipilih"),
  jabatan: z.string().min(1, "Jabatan wajib diisi"),
})

export const suratTugasSchema = z.object({
  kantor: z.string().min(1, "Kantor wajib diisi"),
  tanggal: z.date({ message: "Tanggal wajib diisi" }),
  nomor: z.string().min(1, "Nomor wajib diisi"),
  bagian: z.string().min(1, "Bagian wajib dipilih"),
  kode: z.string().min(1, "Kode wajib dipilih"),
  bulan: z.string().min(1, "Bulan wajib dipilih"),
  pemberiTugas: z.string().min(1, "Pemberi tugas wajib diisi"),
  penerimaTugas: z.array(penerimaTugasSchema),
  ditugaskanKe: z.string().min(1, "Ditugaskan ke wajib diisi"),
  tglPenugasan: z.date({ message: "Tanggal penugasan wajib diisi" }),
  pukul: z.string().min(1, "Pukul wajib diisi"),
  acara: z.string().min(1, "Acara wajib diisi"),
  kendaraan: z.string().min(1, "Pukul wajib dipilih"),
  klasifikasi: z.string().min(1, "Klasifikasi wajib dipilih"),
  tembusan: z.array(penerimaSchema),
  ttd: z.array(tandaTanganSchema).min(1, "Minimal 1 tanda tangan"),
})

export const suratTugasDriverSchema = z.object({
  kantor: z.string().min(1, "Kantor wajib diisi"),
  tanggal: z.date({ message: "Tanggal wajib diisi" }),
  pemberiTugas: z.string().min(1, "Pemberi tugas wajib diisi"),
  jabatan: z.string().min(1, "Jabatan wajib diisi"),
  namaDriver: z.string().min(1, "Nama driver wajib diisi"),
  tglTugas: z.date({ message: "Tanggal wajib diisi" }),
  jamTugas: z.string().min(1, "Jam tugas wajib diiisi"),
  tujuan: z.string().min(1, "Tujuan wajib diiis"),
  keperluan: z.string().min(1, "Keperluan wajib diisi"),
  noPol: z.string().min(1, "No. polisi wajib diisi"),
  klasifikasi: z.string().min(1, "Klasifikasi wajib dipilih"),
})
