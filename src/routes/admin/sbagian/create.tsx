import SBagianForm from "@/components/surat/SBagianForm";
import { usePageTitle } from "@/lib/use-page-title";
import { saveBagian } from "@/services/grup.service";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/sbagian/create")({
  component: RouteComponent,
});

function RouteComponent() {
  usePageTitle("Tambah Data Bagian");
  return (
    <>
      <SBagianForm
        mode="create"
        onSubmit={async (value) => {
          await saveBagian(value);
        }}
      />
    </>
  );
}
