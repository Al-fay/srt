// import { createFileRoute, useNavigate } from "@tanstack/react-router"

// import { SuratForm } from "@/components/surat/SuratForm"
// import { getSurat, updateSurat } from "@/services/surat.service"
// import SuratFormSkeleton from "@/components/skeletons/surat-form-skeleton"

// export const Route = createFileRoute("/surat-keluar/internal/edit/$id")({
//   loader: ({ params }) => getSurat(params.id),
//   pendingComponent: SuratFormSkeleton,
//   component: RouteComponent,
// })

// function RouteComponent() {
//   const surat = Route.useLoaderData()
//   const { id } = Route.useParams()
//   const navigate = useNavigate()

//   return (
//     <SuratForm
//       mode="edit"
//       type="internal"
//       initialData={surat}
//       onSubmit={async (value) => {
//         await updateSurat(id, value)
//         navigate({ to: ".." })
//       }}
//     />
//   )
// }
