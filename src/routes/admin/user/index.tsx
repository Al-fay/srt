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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePageTitle } from "@/lib/use-page-title";
import {
  AktivasiUserViaAdm,
  getUsers,
  resetPassword,
} from "@/services/auth.service";
import type { AllDataUser } from "@/types/user";
import { createFileRoute, Link } from "@tanstack/react-router";
import { createColumnHelper } from "@tanstack/react-table";
import {
  BookAIcon,
  MoreVerticalIcon,
  PlusCircle,
  RotateCcw,
  UserCheck,
  UserRoundX,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/user/")({
  component: RouteComponent,
});

const columnHelper = createColumnHelper<AllDataUser>();

function RouteComponent() {
  usePageTitle("Daftar User");
  const [refreshKey, setRefreshKey] = useState(0);

  const columns = useMemo(
    () => [
      columnHelper.accessor("pass_id", {
        header: "User ID",
      }),
      columnHelper.accessor("pass_name", {
        header: "Nama",
      }),
      columnHelper.accessor("ket", {
        header: "Bagian",
      }),
      columnHelper.accessor("wil_ket", {
        header: "Wilayah",
        cell: (info) => {
          const row = info.row.original;
          return `${row.wil_code} - ${row.wil_ket}`;
        },
      }),
      columnHelper.accessor("nohp", {
        header: "No. HP",
      }),
      columnHelper.accessor("aktiv", {
        header: "Status",
        cell: ({ getValue }) => {
          const aktif = getValue() === 1;
          return (
            <span
              className={`inline-block rounded-full px-2 py-1 text-xs font-medium whitespace-nowrap ${
                aktif
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {aktif ? "Aktif" : "Tidak Aktif"}
            </span>
          );
        },
      }),
      columnHelper.display({
        id: "actions",
        header: "Aksi",
        cell: ({ row }) => {
          const user = row.original;

          const handleAktivasi = async () => {
            try {
              await AktivasiUserViaAdm({
                xpass_id: user.pass_id,
                aktiv: 1,
                xpil: 7,
              });

              toast.success(`User ${user.pass_id} berhasil diaktivasi`);
            } catch (err: any) {
              toast.error(err?.message ?? "Gagal aktivasi user");
            } finally {
              setRefreshKey((k) => k + 1);
            }
          };

          const handleNonAktifUser = async () => {
            try {
              await AktivasiUserViaAdm({
                xpass_id: user.pass_id,
                aktiv: 0,
                xpil: 7,
              });

              toast.success(`User ${user.pass_id} berhasil dinonaktifkan`);
            } catch (err: any) {
              toast.error(err?.message ?? "Gagal nonaktifkan user");
            } finally {
              setRefreshKey((k) => k + 1);
            }
          };

          const handleResetPassword = async () => {
            try {
              await resetPassword({
                xpass_id: user.pass_id,
              });

              toast.success("Password berhasil di-reset");
            } catch (err: any) {
              toast.error(err?.message ?? "Gagal reset password");
            } finally {
              setRefreshKey((k) => k + 1);
            }
          };

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                  <MoreVerticalIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link
                      to="/admin/user/edit/$id"
                      params={{ id: user.pass_id }}
                    >
                      <BookAIcon className="mr-2 size-4" />
                      Edit
                    </Link>
                  </DropdownMenuItem>

                  {/* Aktivasi */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <UserCheck className="mr-2 size-4" />
                        Aktivasi User
                      </DropdownMenuItem>
                    </AlertDialogTrigger>

                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Aktivasi User</AlertDialogTitle>
                        <AlertDialogDescription>
                          Yakin ingin mengaktifkan user <b>{user.pass_id}</b>?
                        </AlertDialogDescription>
                      </AlertDialogHeader>

                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={handleAktivasi}>
                          Ya, Aktivasi
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  {/* Nonaktif */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <UserRoundX className="mr-2 size-4" />
                        Nonaktif User
                      </DropdownMenuItem>
                    </AlertDialogTrigger>

                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Nonaktifkan User</AlertDialogTitle>
                        <AlertDialogDescription>
                          Yakin ingin menonaktifkan user <b>{user.pass_id}</b>?
                        </AlertDialogDescription>
                      </AlertDialogHeader>

                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={handleNonAktifUser}>
                          Ya, Nonaktifkan
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  <DropdownMenuSeparator />

                  {/* Reset Password */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem
                        onSelect={(e) => e.preventDefault()}
                        className="text-destructive"
                      >
                        <RotateCcw className="mr-2 size-4" />
                        Reset Password
                      </DropdownMenuItem>
                    </AlertDialogTrigger>

                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Reset Password</AlertDialogTitle>
                        <AlertDialogDescription>
                          Password user <b>{user.pass_id}</b> akan direset.
                          Lanjutkan?
                        </AlertDialogDescription>
                      </AlertDialogHeader>

                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-destructive text-destructive-foreground"
                          onClick={handleResetPassword}
                        >
                          Ya, Reset
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      }),
    ],
    [],
  );

  const fetchDataUser = useCallback(
    async ({
      page,
      limit,
      search,
      sortBy,
      sortOrder,
      filters,
    }: DataTableQueryParams) => {
      const res = await getUsers({
        page,
        limit,
        search,
        sortBy,
        sortOrder,
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
        <h2 className="text-2xl">Daftar User</h2>

        <Button asChild size="sm">
          <Link to="/admin/user/create" className="gap-2">
            <PlusCircle className="size-4" />
            <span>Tambah</span>
          </Link>
        </Button>
      </div>

      <Card className="my-5 min-w-0 p-6">
        <DataTable
          columns={columns}
          refreshTrigger={refreshKey}
          fetcher={fetchDataUser}
          features={{
            search: true,
            pagination: true,
            rowsPerPage: true,
            sorting: true,
            dateRangeFilter: false,
          }}
          // stickyColumns={["select", "number", "pass_id"]}
          stickyColumns={["select", "pass_id"]}
          onSelectionChange={(rows) => console.log(rows)}
          filters={[
            {
              key: "aktiv",
              label: "Status",
              placeholder: "Semua Status",
              options: [
                { label: "Aktif", value: "active" },
                { label: "Tidak Aktif", value: "inactive" },
              ],
            },
          ]}
        />
      </Card>
    </>
  );
}
