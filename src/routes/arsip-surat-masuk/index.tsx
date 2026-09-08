import { DataTable, type DataTableQueryParams } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { usePageTitle } from "@/lib/use-page-title";
import { getArsipSuratMasuk } from "@/services/arsip-surat-masuk.service";
import { getPreviewSuratMasuk } from "@/services/otorisasi.service";
import type { DataArsipSuratMasuk } from "@/types/arsip-surat-masuk";
import { createFileRoute } from "@tanstack/react-router";
import { createColumnHelper } from "@tanstack/react-table";
import { InfoIcon } from "lucide-react";
import { useCallback, useMemo } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/arsip-surat-masuk/")({
  component: RouteComponent,
});

const columnHelper = createColumnHelper<DataArsipSuratMasuk>();

function RouteComponent() {
  usePageTitle("Arsip Surat Masuk");

  const columns = useMemo(
    () => [
      columnHelper.accessor("no_surat", {
        header: "Nomor Surat",
      }),
      columnHelper.accessor("id_kirim", {
        header: "Pengirim",
      }),
      columnHelper.accessor("perihal", {
        header: "Perihal",
        cell: ({ getValue }) => (
          <div className="max-w-[200px] truncate" title={getValue()}>
            {getValue()}
          </div>
        ),
      }),
      columnHelper.display({
        id: "action",
        header: "Aksi",
        cell: ({ row }) => {
          const surat = row.original;

          const handlePreview = async () => {
            try {
              const xid_surat = Number(surat.id_surat);
              if (Number.isNaN(xid_surat)) {
                toast.error("Surat tidak valid");
                return;
              }
              const data = await getPreviewSuratMasuk(xid_surat);
              const url = URL.createObjectURL(data);
              window.open(url, "_blank");
            } catch (err: any) {
              toast.error(err?.message ?? "Gagal ambil data");
            }
          };

          return (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="cursor-pointer"
                onClick={handlePreview}
              >
                <InfoIcon />
                Preview
              </Button>
            </div>
          );
        },
      }),
    ],
    [],
  );

  const fetchSuratMasuk = useCallback(
    async ({
      page,
      limit,
      search,
      sortBy,
      sortOrder,
      dateFrom,
      dateTo,
      filters,
    }: DataTableQueryParams) => {
      const res = await getArsipSuratMasuk({
        page,
        limit,
        search,
        sortBy,
        sortOrder,
        dateFrom,
        dateTo,
        filters,
      });

      return {
        data: res.data,
        total: res.total,
      };
    },
    [],
  );

  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl">Arsip Surat Masuk</h2>
      </div>

      <Card className="my-5 min-w-0 p-6">
        <DataTable
          columns={columns}
          fetcher={fetchSuratMasuk}
          features={{
            search: true,
            pagination: true,
            rowsPerPage: true,
            sorting: true,
            dateRangeFilter: false,
          }}
          stickyColumns={["select", "no_surat"]}
        />
      </Card>
    </>
  );
}
