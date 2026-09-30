import SBagianForm from "@/components/surat/SBagianForm";
import { getDataBag, updateBagian } from "@/services/grup.service";
import type { BagianForm } from "@/types/grup";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/sbagian/$id/edit")({
  loader: async ({ params }) => {
    const size = 10;
    let page = 1;

    while (true) {
      const response = await getDataBag({
        page,
        limit: size,
      });

      const data = response.data.find(
        (item) => String(item.kode_bag) === params.id,
      );

      if (data) {
        return data;
      }

      const currentPage = response.page;
      const currentSize = response.size;
      const total = response.total;

      if (currentPage * currentSize >= total) {
        break;
      }

      page++;
    }

    throw new Error(`Data bagian dengan kode ${params.id} tidak ditemukan`);
  },

  component: RouteComponent,
});

function RouteComponent() {
  const data = Route.useLoaderData();

  const initialData: BagianForm = {
    xkode_bag: data.kode_bag,
    xket: data.ket,
    xgrup: String(data.grup),
  };
  console.log(initialData);

  const handleSubmit = async (value: BagianForm) => {
    await updateBagian(value);
  };

  return (
    <SBagianForm
      mode="edit"
      initialData={initialData}
      onSubmit={handleSubmit}
      backTo="/admin/sbagian"
    />
  );
}
