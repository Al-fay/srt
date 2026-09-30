import PengumumanLiburFormSkeleton from "@/components/skeletons/pengumuman-libur-form-skeleton";
import PengumumanLiburForm from "@/components/surat/PengumumanLiburForm";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";

export const Route = createFileRoute("/pengumuman-libur/create")({
  pendingComponent: PengumumanLiburFormSkeleton,
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <PengumumanLiburForm
        mode="create"
        onSubmit={async () => {
          // await createSurat(value)
          toast.info("Fitur ini dalam tahap pengembangan");
        }}
      />
    </>
  );
}
