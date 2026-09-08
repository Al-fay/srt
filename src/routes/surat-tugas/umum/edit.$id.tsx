import SuratTugasFormSkeleton from "@/components/skeletons/surat-tugas-form-skeleton"
// import { SuratTugasForm } from "@/components/surat/SuratTugasForm"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/surat-tugas/umum/edit/$id")({
  pendingComponent: SuratTugasFormSkeleton,
  component: RouteComponent,
})

function RouteComponent() {
  // const surat = Route.useLoaderData()
  // const { id } = Route.useParams()
  // const navigate = useNavigate()
  // return (
  //   <SuratTugasForm
  //     mode="edit"
  //     type="umum"
  //     initialData={surat}
  //     // onSubmit={async (value) => {
  //     // await updateSurat(id, value)
  //     // navigate({ to: ".." })
  //     // }}
  //   />
  // )
}
