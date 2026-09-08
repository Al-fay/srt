// import { API_URL } from "@/lib/env"
// import type { SuratFormData } from "@/types/surat"

// const BASE_URL = `${API_URL}/surat`

// function toFormData(value: SuratFormData) {
//   const formData = new FormData()

//   formData.append("kantor", value.kantor)
//   formData.append("tanggal", value.tanggal?.toISOString() ?? "")
//   formData.append("nomor", value.nomor)
//   formData.append("bagian", value.bagian)
//   formData.append("kode", value.kode)
//   formData.append("bulan", value.bulan)
//   formData.append("perihal", value.perihal)
//   // formData.append("alamat", value.alamat)
//   formData.append("isi", value.isi)
//   // formData.append("penutup", value.penutup)
//   formData.append("klasifikasi", value.klasifikasi)
//   formData.append("kepada", JSON.stringify(value.kepada))
//   formData.append("tembusan", JSON.stringify(value.tembusan))
//   formData.append("ttd", JSON.stringify(value.ttd))
//   formData.append("jumlahLampiran", value.jumlahLampiran)

//   value.lampiran.forEach((file) => formData.append("lampiran", file))

//   return formData
// }

// async function handleResponse<T>(response: Response): Promise<T> {
//   if (!response.ok) {
//     const message = await response.text().catch(() => "")
//     throw new Error(message || `Request gagal dengan status ${response.status}`)
//   }

//   return response.json()
// }

// export async function createSurat(value: SuratFormData) {
//   const response = await fetch(BASE_URL, {
//     method: "POST",
//     body: toFormData(value),
//   })

//   return handleResponse(response)
// }

// export async function updateSurat(id: string, value: SuratFormData) {
//   const response = await fetch(`${BASE_URL}/${id}`, {
//     method: "PUT",
//     body: toFormData(value),
//   })

//   return handleResponse(response)
// }

// export async function getSurat(id: string): Promise<SuratFormData> {
//   const response = await fetch(`${BASE_URL}/${id}`)
//   const data = await handleResponse<SuratFormData & { tanggal: Date }>(response)

//   return {
//     ...data,
//     tanggal: data.tanggal ? new Date(data.tanggal) : undefined,
//   }
// }
