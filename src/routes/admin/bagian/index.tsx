import { DataTable, type DataTableQueryParams } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { usePageTitle } from "@/lib/use-page-title";
import { getDataGrupBag } from "@/services/grup.service";
import type { DataBagianGrup } from "@/types/grup";
import { createFileRoute, Link } from "@tanstack/react-router";
import { createColumnHelper } from "@tanstack/react-table";
import { Pencil, PlusCircle } from "lucide-react";
import { useCallback, useMemo } from "react";

export const Route = createFileRoute("/admin/bagian/")({
  component: RouteComponent,
});

const columnHelper = createColumnHelper<DataBagianGrup>();

function RouteComponent() {
  usePageTitle("Data Bagian Grup");

  const columns = useMemo(
    () => [
      columnHelper.accessor("grup", {
        header: "Kode Grup",
      }),
      columnHelper.accessor("ket_grup", {
        header: "Keterangan",
      }),
      columnHelper.display({
        id: "actions",
        header: "Aksi",
        cell: ({ row }) => {
          const data = row.original;

          return (
            <Button asChild size="sm" variant="outline">
              <Link
                to="/admin/bagian/$id/edit"
                params={{
                  id: String(data.grup),
                }}
                className="gap-2 text-yellow-800 dark:text-yellow-300"
              >
                <Pencil className="size-4 text-yellow-800 dark:text-yellow-300" />
                Edit
              </Link>
            </Button>
          );
        },
      }),
    ],
    [],
  );

  const fetchDataBagianGrup = useCallback(
    async ({ page, limit, search }: DataTableQueryParams) => {
      const res = await getDataGrupBag({
        page,
        limit,
        search,
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
      <div className="flex items-center justify-between gap-5">
        <h2 className="text-2xl">Daftar Bagian</h2>

        <Button asChild size="sm">
          <Link to="/admin/bagian/create" className="gap-2">
            <PlusCircle className="size-4" />
            <span>Tambah</span>
          </Link>
        </Button>
      </div>

      <Card className="my-5 min-w-0 p-6">
        <DataTable
          columns={columns}
          fetcher={fetchDataBagianGrup}
          features={{
            search: true,
            pagination: true,
            rowsPerPage: true,
            dateRangeFilter: false,
          }}
          onSelectionChange={(rows) => rows}
        />
      </Card>
    </>
  );
}
