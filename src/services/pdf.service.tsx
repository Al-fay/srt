// import SuratKeluarPdf from "@/components/pdf/SuratKeluarPdf";
// import { API_URL } from "@/lib/env";
// import { pdf } from "@react-pdf/renderer";

// export async function getArsipSuratKeluarReport(xid_surat: number) {
//   const response = await fetch(`${API_URL}/surat-keluar/${xid_surat}`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     credentials: "include",
//   });

//   if (!response.ok) {
//     throw new Error("Gagal mengambil data surat");
//   }

//   const json = await response.json();

//   const blob = await pdf(<SuratKeluarPdf data={json.data} />).toBlob();

//   return blob;
// }
