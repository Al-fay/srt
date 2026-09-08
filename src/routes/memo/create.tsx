// import MemoFormSkeleton from "@/components/skeletons/memo-form-skeleton"
// import MemoForm from "@/components/surat/MemoForm"
// import { usePageTitle } from "@/lib/use-page-title"
// import { createFileRoute, useNavigate } from "@tanstack/react-router"

// export const Route = createFileRoute("/memo/create")({
//   pendingComponent: MemoFormSkeleton,
//   component: RouteComponent,
// })

// function RouteComponent() {
//   usePageTitle("Buat Memo")
//   const navigate = useNavigate()

//   return (
//     <>
//       <MemoForm
//         mode="create"
//         onSubmit={async (value) => {
//           // await createSurat(value)
//           navigate({ to: ".." })
//         }}
//       />
//     </>
//   )
// }
