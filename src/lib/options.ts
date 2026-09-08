import type { ComboboxOption } from "@/components/form/combobox-field"

export const xPilOptions: ComboboxOption[] = [
  { value: "1", label: "Ganti Password" },
  { value: "2", label: "Ganti Nama" },
  { value: "3", label: "Ganti Bagian" },
  { value: "4", label: "Ganti NIP" },
  { value: "5", label: "Ganti No.HP" },
]

export const kantorOptions: ComboboxOption[] = [
  { value: "semua", label: "Semua" },
  { value: "pusat", label: "Pusat" },
  { value: "pekalongan", label: "Pekalongan" },
  { value: "kedungwuni", label: "Kedungwuni" },
]

export const jenisPenerimaOptions: ComboboxOption[] = [
  { value: "1", label: "Individu" },
  { value: "2", label: "Grup" },
]

export const bagianOptions: ComboboxOption[] = [
  { value: "umum", label: "Bagian Umum" },
  { value: "keuangan", label: "Bagian Keuangan" },
  { value: "it", label: "Bagian IT" },
]

export const jabatanOptions: ComboboxOption[] = [
  { value: "manager", label: "Manager" },
  { value: "spv", label: "Supervisor" },
  { value: "staff", label: "Staff" },
]

export const mediaOptions: ComboboxOption[] = [
  { value: "email", label: "Email" },
  { value: "wa", label: "WhatsApp" },
  { value: "surat", label: "Surat" },
]
