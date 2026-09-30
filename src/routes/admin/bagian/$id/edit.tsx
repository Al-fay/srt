import BagianForm from "@/components/surat/BagianForm";
import { getDataGrupBag, updateBagianGrup } from "@/services/grup.service";
import type { BagianGrupForm } from "@/types/grup";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/bagian/$id/edit")({
  loader: async ({ params }) => {
    const size = 10;
    let page = 1;

    while (true) {
      const response = await getDataGrupBag({
        page,
        limit: size,
      });

      const data = response.data.find(
        (item) => String(item.grup) === params.id,
      );

      if (data) {
        return { data };
      }

      const currentPage = response.page;
      const currentSize = response.size;
      const total = response.total;

      if (currentPage * currentSize >= total) {
        break;
      }

      page++;
    }

    throw new Error("Data bagian grup tidak ditemukan");
  },

  component: RouteComponent,
});

function RouteComponent() {
  const { data } = Route.useLoaderData();

  const initialData: BagianGrupForm = {
    xkd_grup: data.grup,
    xket_grup: data.ket_grup,
  };

  const handleSubmit = async (value: BagianGrupForm) => {
    await updateBagianGrup(value);
  };

  return (
    <BagianForm
      mode="edit"
      initialData={initialData}
      onSubmit={handleSubmit}
      backTo="/admin/bagian"
    />
  );
}
