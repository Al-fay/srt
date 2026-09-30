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
import { api } from "@/lib/api";
import { usePageTitle } from "@/lib/use-page-title";
import { getArsipSuratMasuk } from "@/services/arsip-surat-masuk.service";
import { getPreviewSuratMasuk } from "@/services/otorisasi.service";
import type { DataArsipSuratMasuk } from "@/types/arsip-surat-masuk";
import { createFileRoute } from "@tanstack/react-router";
import { createColumnHelper } from "@tanstack/react-table";
import { Download, FileIcon, InfoIcon, MoreVerticalIcon } from "lucide-react";
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
      columnHelper.display({
        id: "actions",
        header: "Aksi",
        cell: ({ row }) => {
          const surat = row.original;
          const nomorSurat = surat.no_surat;
          const hal = surat.perihal;

          const attachmentFiles = (surat.lampiran ?? []).flatMap((item) =>
            item.lampiran
              ? item.lampiran
                  .split(",")
                  .map((file) => file.trim())
                  .filter(Boolean)
              : [],
          );

          const getFileUrl = (filePath: string) => {
            const normalizedPath = filePath.replace(/^\/+/, "");

            return `/surat/files/${normalizedPath
              .split("/")
              .map(encodeURIComponent)
              .join("/")}`;
          };

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

          const handlePreviewNoLabel = async () => {
            try {
              const xid_surat = Number(surat.id_surat);

              if (Number.isNaN(xid_surat)) {
                toast.error("Surat tidak valid");
                return;
              }

              const data = await getPreviewSuratMasuk(xid_surat, true);

              const url = URL.createObjectURL(data);

              window.open(url, "_blank", "noopener,noreferrer");

              setTimeout(() => {
                URL.revokeObjectURL(url);
              }, 1000);
            } catch (err: any) {
              console.error("Preview error:", err);
              toast.error(err?.message ?? "Gagal ambil data");
            }
          };

          const handleDownload = async () => {
            try {
              const xid_surat = Number(surat.id_surat);

              if (Number.isNaN(xid_surat)) {
                toast.error("Surat tidak valid");
                return;
              }

              const data = await getPreviewSuratMasuk(xid_surat);

              const url = URL.createObjectURL(data);

              const link = document.createElement("a");
              link.href = url;
              link.download = `surat-masuk-${nomorSurat}-${hal}-${new Date()
                .toISOString()
                .slice(0, 10)}.pdf`;

              document.body.appendChild(link);
              link.click();
              link.remove();

              URL.revokeObjectURL(url);
            } catch (err: any) {
              console.error("Download error:", err);
              toast.error(err?.message ?? "Gagal ambil data");
            }
          };

          const handleDownloadNoLabel = async () => {
            try {
              const xid_surat = Number(surat.id_surat);

              if (Number.isNaN(xid_surat)) {
                toast.error("Surat tidak valid");
                return;
              }

              const data = await getPreviewSuratMasuk(xid_surat, true);

              const url = URL.createObjectURL(data);

              const link = document.createElement("a");
              link.href = url;
              link.download = `surat-keluar-${nomorSurat}-${hal}-${new Date()
                .toISOString()
                .slice(0, 10)}.pdf`;

              document.body.appendChild(link);
              link.click();
              link.remove();

              setTimeout(() => {
                URL.revokeObjectURL(url);
              }, 1000);
            } catch (err: any) {
              toast.error(err?.message ?? "Gagal ambil data");
            }
          };

          const handleAttachment = async (filePath: string) => {
            try {
              const fileUrl = getFileUrl(filePath);

              const blob = await api<Blob>(fileUrl, {
                method: "GET",
                responseType: "blob",
              });

              const url = URL.createObjectURL(blob);
              window.open(url, "_blank", "noopener,noreferrer");

              setTimeout(() => {
                URL.revokeObjectURL(url);
              }, 1000);
            } catch (err: any) {
              console.error("Preview attachment error:", err);
              toast.error(err?.message ?? "Gagal mengambil lampiran");
            }
          };

          const handleAttachmentDownload = async (
            filePath: string,
            index: number,
          ) => {
            try {
              const fileUrl = getFileUrl(filePath);

              const blob = await api<Blob>(fileUrl, {
                method: "GET",
                responseType: "blob",
              });

              const url = URL.createObjectURL(blob);
              const link = document.createElement("a");

              link.href = url;
              link.download =
                filePath.split("/").pop() || `lampiran-${index + 1}`;

              document.body.appendChild(link);
              link.click();
              link.remove();

              setTimeout(() => {
                URL.revokeObjectURL(url);
              }, 1000);
            } catch (err: any) {
              console.error("Download attachment error:", err);
              toast.error(err?.message ?? "Gagal mengunduh lampiran");
            }
          };

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

                  <DropdownMenuItem onSelect={handlePreviewNoLabel}>
                    <InfoIcon className="mr-2 h-4 w-4" />
                    <span>Preview Blank</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem onSelect={handleDownload}>
                    <Download className="mr-2 h-4 w-4" />
                    <span>Unduh</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem onSelect={handleDownloadNoLabel}>
                    <Download className="mr-2 h-4 w-4" />
                    <span>Unduh Blank</span>
                  </DropdownMenuItem>

                  {attachmentFiles.length > 0 &&
                    attachmentFiles.map((filePath, index) => (
                      <>
                        <DropdownMenuItem
                          key={`${filePath}-${index}`}
                          onSelect={() => handleAttachment(filePath)}
                        >
                          <FileIcon className="mr-2 h-4 w-4" />
                          <span>Lampiran {index + 1}</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() =>
                            handleAttachmentDownload(filePath, index)
                          }
                        >
                          <Download className="mr-2 h-4 w-4" />
                          <span>Unduh Lampiran {index + 1}</span>
                        </DropdownMenuItem>
                      </>
                    ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      }),
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
