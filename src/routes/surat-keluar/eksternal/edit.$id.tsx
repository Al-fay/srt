// import SuratFormSkeleton from "@/components/skeletons/surat-form-skeleton"
// import { SuratForm } from "@/components/surat/SuratForm"
// import { useNavigate } from "@tanstack/react-router"
// import { createFileRoute } from "@tanstack/react-router"

// export const Route = createFileRoute("/surat-keluar/eksternal/edit/$id")({
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
