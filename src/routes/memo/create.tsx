import MemoFormSkeleton from "@/components/skeletons/memo-form-skeleton";
import MemoForm from "@/components/surat/MemoForm";
import { usePageTitle } from "@/lib/use-page-title";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";

export const Route = createFileRoute("/memo/create")({
  pendingComponent: MemoFormSkeleton,
  component: RouteComponent,
});

function RouteComponent() {
  usePageTitle("Buat Memo");

  return (
    <>
      <MemoForm
        mode="create"
        onSubmit={async () => {
          // await createSurat(value)
          toast.info("Fitur ini dalam tahap pengembangan");
        }}
      />
    </>
  );
}
