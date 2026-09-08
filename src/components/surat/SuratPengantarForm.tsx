// import { defaultPengantar } from "@/lib/defaultPengantar"
// import type { SuratPengantarData, SuratPengantarMode } from "@/types/pengantar"
// import { useForm } from "@tanstack/react-form"
// import { Button } from "../ui/button"
// import { Link } from "@tanstack/react-router"
// import { ArrowLeft, ListRestart, Save } from "lucide-react"
// import { Card } from "../ui/card"
// import { Field, FieldGroup, FieldSeparator, FieldSet } from "../ui/field"
// import { ComboboxField } from "../form/combobox-field"
// import { DateField } from "../form/date-field"
// import { TextField } from "../form/text-field"
// import { BarangField } from "../form/barang-field"
// import {
//   getBagianOptions,
//   getBulanOptions,
//   getKantorOptions,
//   getKodeOptions,
//   getTujuanOptions,
// } from "@/services/options.service"

// type Props = {
//   mode: SuratPengantarMode
//   initialData?: SuratPengantarData
//   onSubmit: (value: SuratPengantarData) => Promise<void> | void
//   backTo?: string
// }

// export default function SuratPengantarForm({
//   mode,
//   initialData,
//   onSubmit,
//   backTo = "..",
// }: Props) {
//   const form = useForm({
//     defaultValues: initialData ?? defaultPengantar,
//     validators: {
//       // onSubmit: suratSchema,
//     },
//     onSubmit: async ({ value }) => {
//       await onSubmit(value)
//     },
//   })

//   const title =
//     mode === "create" ? "Buat Surat Pengantar" : "Ubah Surat Pengantar"

//   return (
//     <>
//       <div className="flex items-center justify-between">
//         <h2 className="text-2xl">{title}</h2>

//         <Button asChild size="sm">
//           <Link to={backTo} className="gap-2">
//             <ArrowLeft className="size-4" />
//             <span>Kembali</span>
//           </Link>
//         </Button>
//       </div>

//       <Card className="my-5 px-10 py-5 shadow-lg">
//         <form
//           onSubmit={(e) => {
//             e.preventDefault()
//             e.stopPropagation()
//             form.handleSubmit()
//           }}
//         >
//           <FieldGroup>
//             <FieldSet>
//               <FieldGroup>
//                 <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
//                   <form.Field name="kantor">
//                     {(field) => (
//                       <ComboboxField
//                         field={field}
//                         label="Kantor"
//                         options={[]}
//                         queryKey={["kantor-options"]}
//                         queryFn={getKantorOptions}
//                         placeholder="Cari kantor..."
//                       />
//                     )}
//                   </form.Field>

//                   <form.Field name="tanggal">
//                     {(field) => <DateField field={field} />}
//                   </form.Field>
//                 </div>

//                 <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
//                   <form.Field name="nomor">
//                     {(field) => (
//                       <TextField
//                         field={field}
//                         label="Nomor"
//                         placeholder="001"
//                         maxLength={3}
//                         onlyNumber
//                         inputMode="numeric"
//                       />
//                     )}
//                   </form.Field>

//                   <form.Field name="bagian">
//                     {(field) => (
//                       <ComboboxField
//                         field={field}
//                         label="Kantor/Bagian"
//                         options={[]}
//                         queryKey={["bagian-options"]}
//                         queryFn={getBagianOptions}
//                         placeholder="Cari bagian..."
//                       />
//                     )}
//                   </form.Field>

//                   <form.Field name="kode">
//                     {(field) => (
//                       <ComboboxField
//                         field={field}
//                         label="Kode"
//                         options={[]}
//                         queryKey={["kode-options"]}
//                         queryFn={getKodeOptions}
//                         placeholder="Cari kode..."
//                       />
//                     )}
//                   </form.Field>

//                   <form.Field name="bulan">
//                     {(field) => (
//                       <ComboboxField
//                         field={field}
//                         label="Bulan"
//                         options={[]}
//                         queryKey={["bulan-options"]}
//                         queryFn={getBulanOptions}
//                         placeholder="Cari bulan..."
//                       />
//                     )}
//                   </form.Field>
//                 </div>

//                 <form.Field name="tujuan.tipe">
//                   {(field) => (
//                     <ComboboxField
//                       field={field}
//                       label="Tujuan"
//                       options={[]}
//                       queryKey={["tujuan-options"]}
//                       queryFn={getTujuanOptions}
//                       placeholder="Pilih tujuan"
//                       onValueChange={(value) => {
//                         if (value === "Internal") {
//                           form.setFieldValue("tujuan", {
//                             tipe: "Internal",
//                             kantor: "",
//                             nama: "",
//                             jabatan: "",
//                           })
//                         }

//                           form.setFieldValue("tujuan", {
//                             tipe: "Eksternal",
//                             nama: "",
//                             jabatan: "",
//                             alamat: "",
//                           })
//                         }
//                       }}
//                     />
//                 </form.Field>

//                 <form.Subscribe selector={(state) => state.values.tujuan.tipe}>
//                   {(tujuanType) =>
//                     tujuanType === "Internal" ? (
//                       <div className="grid gap-5 md:grid-cols-2">
//                         <form.Field name="tujuan.nama">
//                           {(field) => (
//                             <TextField
//                               field={field}
//                               label="Nama/Jabatan Tujuan"
//                               placeholder="Masukkan nama"
//                             />
//                           )}
//                         </form.Field>

//                         <form.Field name="tujuan.kantor">
//                           {(field) => (
//                             <ComboboxField
//                               field={field}
//                               label="Kantor"
//                               options={[]}
//                               queryKey={["kantor-options"]}
//                               queryFn={getKantorOptions}
//                               placeholder="Pilih kantor"
//                             />
//                           )}
//                         </form.Field>
//                       </div>
//                     ) : (
//                       <div className="grid gap-5 md:grid-cols-2">
//                         <form.Field name="tujuan.nama">
//                           {(field) => (
//                             <TextField
//                               field={field}
//                               label="Nama Tujuan"
//                               placeholder="Masukkan nama"
//                             />
//                           )}
//                         </form.Field>

//                         <form.Field name="tujuan.alamat">
//                           {(field) => (
//                             <TextField
//                               field={field}
//                               label="Alamat"
//                               placeholder="Masukkan alamat"
//                             />
//                           )}
//                         </form.Field>
//                       </div>
//                     )
//                   }
//                 </form.Subscribe>

//                 <form.Field name="pengirim">
//                   {(field) => (
//                     <TextField
//                       field={field}
//                       label="Pengirim"
//                       placeholder="Nama pengirim"
//                     />
//                   )}
//                 </form.Field>

//                 <form.Field name="daftarBarangDokumen">
//                   {(field) => (
//                     <BarangField field={field} label="Daftar Barang/ Dokumen" />
//                   )}
//                 </form.Field>
//               </FieldGroup>
//             </FieldSet>

//             <FieldSeparator />

//             <Field orientation="horizontal" className="justify-end">
//               <Button
//                 size="sm"
//                 variant="outline"
//                 type="button"
//                 className="cursor-pointer shadow-lg"
//                 onClick={() => form.reset()}
//               >
//                 <ListRestart className="size-4" />
//                 Reset
//               </Button>

//               <form.Subscribe selector={(state) => state.isSubmitting}>
//                 {(isSubmitting) => (
//                   <Button
//                     size="sm"
//                     type="submit"
//                     className="cursor-pointer items-center shadow-lg"
//                     disabled={isSubmitting}
//                   >
//                     <Save className="size-4" />
//                     {isSubmitting ? "Menyimpan..." : "Submit"}
//                   </Button>
//                 )}
//               </form.Subscribe>
//             </Field>
//           </FieldGroup>
//         </form>
//       </Card>
//     </>
//   )
// }
