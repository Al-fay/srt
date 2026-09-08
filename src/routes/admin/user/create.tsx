import { UserFrom } from "@/components/surat/UserForm"
import { usePageTitle } from "@/lib/use-page-title"
import { signUpService } from "@/services/auth.service"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/admin/user/create")({
  component: RouteComponent,
})

function RouteComponent() {
  usePageTitle("Tambah User")

  return (
    <>
      <UserFrom
        mode="create"
        onSubmit={async (value) => {
          await signUpService(value)
        }}
      />
    </>
  )
}
