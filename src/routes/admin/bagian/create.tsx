import BagianForm from "@/components/surat/BagianForm";
import { usePageTitle } from "@/lib/use-page-title";
import { saveBagianGrup } from "@/services/grup.service";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/bagian/create")({
  component: RouteComponent,
});

function RouteComponent() {
  usePageTitle("Tambah Data Bagian Grup");

  return (
    <>
      <BagianForm
        mode="create"
        onSubmit={async (value) => {
          await saveBagianGrup(value);
        }}
      />
    </>
  );
}
