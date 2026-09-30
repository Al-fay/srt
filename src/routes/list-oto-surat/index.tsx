import { DataTable, type DataTableQueryParams } from "@/components/data-table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import {
  getOtorisasi,
  getPreviewSuratOto,
  saveOtorisasi,
} from "@/services/otorisasi.service";
import type { AllDataOtorisasi } from "@/types/otorisasi";
import { createFileRoute } from "@tanstack/react-router";
import { createColumnHelper } from "@tanstack/react-table";
import {
  CheckCircle,
  Download,
  FileIcon,
  InfoIcon,
  MoreVerticalIcon,
} from "lucide-react";
import { Fragment, useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/list-oto-surat/")({
  component: RouteComponent,
});

const columnHelper = createColumnHelper<AllDataOtorisasi>();

function RouteComponent() {
  usePageTitle("Daftar Otorisasi Surat");
  const [refreshKey, setRefreshKey] = useState(0);

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "action",
        header: "Aksi",
        cell: ({ row }) => {
          const surat = row.original;
          const nomorSurat = surat.no_surat;
          const hal = surat.perihal;
          const [openVerifikasi, setOpenVerifikasi] = useState(false);

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

          const handleVerifikasi = async () => {
            try {
              const noSurat = surat.no_surat.replace("/Kspps.Js", "");

              const response = await saveOtorisasi({
                Xid_surat: surat.id_surat,
                Xno_surat: noSurat,
              });

              toast.success(response.message);
              setOpenVerifikasi(false);
            } catch (error: any) {
              toast.error(error?.message ?? "Terjadi kesalahan");
            } finally {
              setRefreshKey((k) => k + 1);
            }
          };

          const handlePreview = async () => {
            try {
              const xid_surat = Number(surat.id_surat);

              if (Number.isNaN(xid_surat)) {
                toast.error("ID surat tidak valid");
                return;
              }

              const data = await getPreviewSuratOto(xid_surat);

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

              const data = await getPreviewSuratOto(xid_surat, true);

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

              const data = await getPreviewSuratOto(xid_surat);

              const url = URL.createObjectURL(data);

              const link = document.createElement("a");
              link.href = url;
              link.download = `surat-${hal}-${nomorSurat}-${new Date()
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

              const data = await getPreviewSuratOto(xid_surat, true);

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
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="h-8 w-8 p-0">
                    <MoreVerticalIcon className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="start" className="w-44">
                  <DropdownMenuGroup>
                    {surat.oto !== 1 && (
                      <DropdownMenuItem
                        onSelect={(e) => {
                          e.preventDefault();
                          setOpenVerifikasi(true);
                        }}
                        className="cursor-pointer bg-green-400 text-white focus:bg-green-500"
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Verifikasi
                      </DropdownMenuItem>
                    )}

                    <DropdownMenuItem
                      onSelect={handlePreview}
                      className="cursor-pointer"
                    >
                      <InfoIcon className="mr-2 h-4 w-4" />
                      Preview
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

                    {attachmentFiles.map((filePath, index) => (
                      <Fragment key={`${filePath}-${index}`}>
                        <DropdownMenuItem
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
                      </Fragment>
                    ))}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              <AlertDialog
                open={openVerifikasi}
                onOpenChange={setOpenVerifikasi}
              >
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Verifikasi Surat</AlertDialogTitle>

                    <AlertDialogDescription>
                      Yakin ingin memverifikasi surat dengan nomor{" "}
                      <b>{surat.no_surat}</b>?
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <AlertDialogFooter>
                    <AlertDialogCancel className="cursor-pointer">
                      Batal
                    </AlertDialogCancel>

                    <AlertDialogAction
                      onClick={handleVerifikasi}
                      className="cursor-pointer"
                    >
                      Ya, Verifikasi
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          );
        },
      }),
      columnHelper.accessor("id_kirim", {
        header: "Pengirim",
      }),
      columnHelper.accessor("no_surat", {
        header: "Nomor Surat",
      }),
      columnHelper.accessor("perihal", {
        header: "Perihal",
        cell: ({ getValue }) => (
          <div className="max-w-[300px] truncate" title={getValue()}>
            {getValue()}
          </div>
        ),
      }),
      columnHelper.accessor("kepada", {
        header: "Kepada",
        cell: ({ getValue }) => (
          <div className="max-w-[300px] truncate" title={getValue()}>
            {getValue()}
          </div>
        ),
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

  const fetchOtorisasi = useCallback(
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
      const res = await getOtorisasi({
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
        <h2 className="text-2xl">Daftar Otorisasi</h2>
      </div>

      <Card className="my-5 min-w-0 p-6">
        <DataTable
          columns={columns}
          refreshTrigger={refreshKey}
          fetcher={fetchOtorisasi}
          rowColorOptions={[
            {
              value: "sudah-otorisasi",
              condition: (row) => row.oto === 1,
              className:
                "bg-green-200 hover:bg-green-100 dark:bg-green-950/30 dark:hover:bg-green-950/50",
            },
            {
              value: "belum-otorisasi",
              condition: (row) => row.oto !== 1,
              className:
                "bg-red-200 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-950/50",
            },
          ]}
          features={{
            search: true,
            pagination: true,
            rowsPerPage: true,
            sorting: true,
            dateRangeFilter: false,
          }}
          stickyColumns={["select", "id_kirim"]}
          filters={[
            {
              key: "oto",
              label: "Status",
              placeholder: "Semua Otorisasi",
              options: [
                {
                  label: "Sudah Otorisasi",
                  value: "voto",
                },
                {
                  label: "Belum Otorisasi",
                  value: "xoto",
                },
              ],
            },
          ]}
        />
      </Card>
    </>
  );
}
