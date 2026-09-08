import SuratFormSkeleton from "@/components/skeletons/surat-form-skeleton";
import { SuratForm } from "@/components/surat/SuratForm";
import { usePageTitle } from "@/lib/use-page-title";
import { createSuratInternal } from "@/services/surat.internal.services";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/surat-keluar/eksternal/create")({
  pendingComponent: SuratFormSkeleton,
  component: RouteComponent,
});

function RouteComponent() {
  usePageTitle("Buat Surat Keluar Eksternal");

  return (
    <SuratForm
      mode="create"
      type="eksternal"
      onSubmit={async (value) => {
        await createSuratInternal(value);
      }}
    />
  );
}
