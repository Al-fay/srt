// import SuratTugasFormSkeleton from "@/components/skeletons/surat-tugas-form-skeleton"
// import { SuratTugasDriverForm } from "@/components/surat/SuratTugasDriver"
// import { createFileRoute, useNavigate } from "@tanstack/react-router"

// export const Route = createFileRoute("/surat-tugas/driver/edit/$id")({
//   pendingComponent: SuratTugasFormSkeleton,
//   component: RouteComponent,
// })

// function RouteComponent() {
//   const surat = Route.useLoaderData()
//   const { id } = Route.useParams()
//   const navigate = useNavigate()

//   return (
//     <SuratTugasDriverForm
//       mode="edit"
//       type="driver"
//       initialData={surat}
//       onSubmit={async (value) => {
//         // await updateSurat(id, value)
//         navigate({ to: ".." })
//       }}
//     />
//   )
// }
