import { DataTable, type DataTableQueryParams } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { usePageTitle } from "@/lib/use-page-title";
import { getDataBag } from "@/services/grup.service";
import type { DataBag } from "@/types/grup";
import { createFileRoute, Link } from "@tanstack/react-router";
import { createColumnHelper } from "@tanstack/react-table";
import { Pencil, PlusCircle } from "lucide-react";
import { useCallback, useMemo } from "react";

export const Route = createFileRoute("/admin/sbagian/")({
  component: RouteComponent,
});

const columnHelper = createColumnHelper<DataBag>();

function RouteComponent() {
  usePageTitle("Data Bagian");

  const columns = useMemo(
    () => [
      columnHelper.accessor("kode_bag", {
        header: "Kode Bagian",
      }),
      columnHelper.accessor("ket", {
        header: "Keterangan",
      }),
      columnHelper.accessor("ket_grup", {
        header: "Grup",
        cell: (info) => info.getValue() ?? "-",
      }),
      columnHelper.display({
        id: "actions",
        header: "Aksi",
        cell: ({ row }) => {
          const data = row.original;

          return (
            <Button asChild size="sm" variant="outline">
              <Link
                to="/admin/sbagian/$id/edit"
                params={{
                  id: String(data.kode_bag),
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

  const fetchDataBagian = useCallback(
    async ({ page, limit, search, filters }: DataTableQueryParams) => {
      const res = await getDataBag({
        page,
        limit,
        search,
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
      <div className="flex items-center justify-between gap-5">
        <h2 className="text-2xl">Daftar Bagian</h2>

        <Button asChild size="sm">
          <Link to="/admin/sbagian/create" className="gap-2">
            <PlusCircle className="size-4" />
            <span>Tambah</span>
          </Link>
        </Button>
      </div>

      <Card className="my-5 min-w-0 p-6">
        <DataTable
          columns={columns}
          fetcher={fetchDataBagian}
          features={{
            search: true,
            pagination: true,
            rowsPerPage: true,
            sorting: false,
            dateRangeFilter: false,
          }}
          stickyColumns={["select", "ket"]}
          onSelectionChange={(rows) => rows}
        />
      </Card>
    </>
  );
}
