import { createFileRoute } from "@tanstack/react-router";

import { SuratForm } from "@/components/surat/SuratForm";
import SuratFormSkeleton from "@/components/skeletons/surat-form-skeleton";
import { usePageTitle } from "@/lib/use-page-title";
import { createSuratInternal } from "@/services/surat.internal.services";

export const Route = createFileRoute("/surat-keluar/internal/create")({
  pendingComponent: SuratFormSkeleton,
  component: RouteComponent,
});

function RouteComponent() {
  usePageTitle("Buat Surat Keluar Internal/Eksternal");

  return (
    <SuratForm
      mode="create"
      type="internal"
      onSubmit={async (value) => {
        await createSuratInternal(value);
      }}
    />
  );
}
