import { DataTable, type DataTableQueryParams } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePageTitle } from "@/lib/use-page-title";
import {
  getArsipSuratKeluar,
  getArsipSuratKeluarReport,
} from "@/services/arsip-surat-keluar.service";
import type { DataArsipSuratKeluar } from "@/types/arsip-surat-keluar";
import { createFileRoute } from "@tanstack/react-router";
import { createColumnHelper } from "@tanstack/react-table";
import { Download, InfoIcon, MoreVerticalIcon } from "lucide-react";
import { useCallback, useMemo } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/arsip-surat-keluar/")({
  component: RouteComponent,
});

const columnHelper = createColumnHelper<DataArsipSuratKeluar>();

function RouteComponent() {
  usePageTitle("Arsip Surat Keluar");

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "actions",
        header: "Aksi",
        cell: ({ row }) => {
          const user = row.original;
          const nomorSurat = user.no_surat;
          const hal = user.perihal;

          const handlePreview = async () => {
            try {
              const xid_surat = Number(user.id_surat);

              if (Number.isNaN(xid_surat)) {
                toast.error("Surat tidak valid");
                return;
              }

              const data = await getArsipSuratKeluarReport(xid_surat);

              const url = URL.createObjectURL(data);

              window.open(url, "_blank");
            } catch (err: any) {
              console.error("Preview error:", err);
              toast.error(err?.message ?? "Gagal ambil data");
            }
          };

          const handleDownload = async () => {
            try {
              const xid_surat = Number(user.id_surat);

              if (Number.isNaN(xid_surat)) {
                toast.error("Surat tidak valid");
                return;
              }

              const data = await getArsipSuratKeluarReport(xid_surat);

              const url = URL.createObjectURL(data);

              const link = document.createElement("a");
              link.href = url;
              link.download = `surat-keluar-${nomorSurat}-${hal}-${new Date().toISOString().slice(0, 10)}.pdf`;

              document.body.appendChild(link);
              link.click();
              link.remove();

              URL.revokeObjectURL(url);
            } catch (err: any) {
              console.error("Download error:", err);
              toast.error(err?.message ?? "Gagal ambil data");
            }
          };

          // if (user?.stat_oto === "1") {
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8 p-0">
                  <MoreVerticalIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="start" className="w-44">
                <DropdownMenuGroup>
                  <DropdownMenuItem onSelect={handlePreview}>
                    <InfoIcon className="mr-2 h-4 w-4" />
                    <span>Preview</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem onSelect={handleDownload}>
                    <Download className="mr-2 h-4 w-4" />
                    <span>Unduh</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          );
          // }
        },
      }),
      columnHelper.accessor("no_surat", {
        header: "Nomor Surat",
      }),
      columnHelper.accessor("perihal", {
        header: "Perihal",
        cell: ({ getValue }) => (
          <div className="max-w-[200px] truncate" title={getValue()}>
            {getValue()}
          </div>
        ),
      }),

      columnHelper.accessor("kepada", {
        header: "Kepada",
        cell: ({ getValue }) => (
          <div className="max-w-[200px] truncate" title={getValue()}>
            {getValue()}
          </div>
        ),
      }),
      columnHelper.accessor("stat_oto", {
        header: "Status Verifikasi",
        cell: ({ getValue }) => {
          const value = getValue() === "0";
          return (
            <span
              className={`inline-block rounded-full px-2 py-1 text-xs font-medium whitespace-nowrap ${
                value
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {value ? "Belum Verifikasi" : "Terverifikasi"}
            </span>
          );
        },
      }),
      columnHelper.accessor("tgl_kirim", {
        header: "Tanggal Kirim",
        cell: ({ getValue }) => {
          const value = getValue();
          return value
            ? new Date(value).toLocaleDateString("id-ID", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : "-";
        },
      }),
    ],
    [],
  );

  const fetchSuratKeluar = useCallback(
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
      const res = await getArsipSuratKeluar({
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
        <h2 className="text-2xl">Arsip Surat Keluar</h2>
      </div>

      <Card className="my-5 min-w-0 p-6">
        <DataTable
          columns={columns}
          fetcher={fetchSuratKeluar}
          features={{
            search: true,
            pagination: true,
            rowsPerPage: true,
            sorting: true,
            dateRangeFilter: false,
          }}
          stickyColumns={["select", "no_surat"]}
          filters={[
            {
              key: "stat_oto",
              label: "Status",
              placeholder: "Semua Status",
              options: [
                { label: "Sudah Verifikasi", value: "active" },
                { label: "Belum Verifikasi", value: "inactive" },
              ],
            },
          ]}
        />
      </Card>
    </>
  );
}
