import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, LogOut, PencilIcon } from "lucide-react";
import { usePageTitle } from "@/lib/use-page-title";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FieldError, FieldGroup } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  changePassword,
  meService,
  signOutService,
} from "@/services/auth.service";
import { toast } from "sonner";

export const Route = createFileRoute("/profile")({
  component: RouteComponent,
});

function RouteComponent() {
  usePageTitle("Profile");
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [open, setOpen] = useState(false);
  const { data, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: meService,
  });

  const form = useForm({
    defaultValues: {
      xpil: 1,
      xpass_id: "",
      xpass_wd: "",
      xcpass_wd: "",
    },
    onSubmit: async ({ value, formApi }) => {
      try {
        await changePassword(value);
        toast.success("Password berhasil diubah");
        handleCloseDialog();
      } catch (error: any) {
        // console.log("Backend Error ", error)
        // console.log("Response Error ", error.response)

        toast.error(error?.message ?? "Terjadi kesalahan");

        const details = error.response?.error?.details ?? [];

        // console.log("Details error ", details)

        details.forEach((item: any) => {
          formApi.setFieldMeta(item.field, (prev) => ({
            ...prev,
            errorMap: {
              ...prev.errorMap,
              onSubmit: item.message,
            },
          }));
        });
      }
    },
  });

  const handleCloseDialog = () => {
    form.reset();
    setShowPassword(false);
    setShowConfirmPassword(false);
    setOpen(false);
  };

  const handleSignOut = async () => {
    try {
      await signOutService();

      queryClient.clear();
    } catch (error: any) {
      toast.error("Logout gagal", error);
    } finally {
      queryClient.removeQueries({
        queryKey: ["me"],
      });

      navigate({
        to: "/auth/sign-in",
      });
    }
  };

  const user = data?.data;

  const handleOpenDialog = () => {
    if (user?.pass_id) {
      form.setFieldValue("xpass_id", user.pass_id);
    }
    setOpen(true);
  };

  const initial = user?.pass_name
    ? user?.pass_name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="w-full max-w-2xl overflow-hidden shadow-xl">
      <CardHeader className="border-b px-4 py-4 sm:px-6">
        <CardTitle className="text-xl font-bold sm:text-2xl">
          My Profile
        </CardTitle>
      </CardHeader>

      <CardContent className="grid min-w-0 gap-6 p-4 sm:p-6 md:grid-cols-2 md:gap-8 md:p-8">
        {/* PROFILE */}
        <div className="flex min-w-0 flex-col items-center gap-5">
          <Avatar className="h-24 w-24 sm:h-28 sm:w-28">
            <AvatarFallback className="text-2xl text-primary bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 font-semibold text-white text-shadow-xs sm:text-3xl">
              {initial}
            </AvatarFallback>
          </Avatar>

          <div className="max-w-full min-w-0 text-center">
            <h2 className="truncate text-lg font-semibold sm:text-xl">
              {user?.pass_name?.toLocaleUpperCase()}
            </h2>

            <p className="truncate text-sm text-muted-foreground mb-5">
              {user?.pass_id}
            </p>

            <span
              className={`inline-block rounded-full px-2 py-1 text-xs font-medium whitespace-nowrap ${
                user?.aktiv
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {user?.aktiv ? "Aktif" : "Tidak Aktif"}
            </span>
          </div>

          <div className="flex w-full min-w-0 flex-col gap-3">
            <Dialog
              open={open}
              onOpenChange={(value) => {
                if (!value) {
                  handleCloseDialog();
                } else {
                  handleOpenDialog();
                }
              }}
            >
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full min-w-0 cursor-pointer gap-2"
                >
                  <PencilIcon size={18} />
                  Ubah Password
                </Button>
              </DialogTrigger>

              <DialogContent className="w-[calc(100%-2rem)] max-w-sm">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    form.handleSubmit();
                  }}
                >
                  <DialogHeader className="mb-3">
                    <DialogTitle>Edit password</DialogTitle>
                    <DialogDescription>
                      Lakukan perubahan pada password Anda di sini. Klik simpan
                      setelah selesai.
                    </DialogDescription>
                  </DialogHeader>

                  <FieldGroup>
                    <form.Field name="xpass_id">
                      {(field) => (
                        <div className="grid gap-2">
                          <Label htmlFor={field.name}>Mail</Label>
                          <Input
                            id={field.name}
                            name={field.name}
                            type="text"
                            className="shadow-xl"
                            placeholder="Masukkan mail"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onCopy={(e) => e.preventDefault()}
                            onCut={(e) => e.preventDefault()}
                            onPaste={(e) => e.preventDefault()}
                            onDragStart={(e) => e.preventDefault()}
                            readOnly
                          />
                          <FieldError>
                            {field.state.meta.errorMap.onSubmit}
                          </FieldError>
                        </div>
                      )}
                    </form.Field>

                    <form.Field name="xpass_wd">
                      {(field) => (
                        <div className="grid gap-2">
                          <Label htmlFor={field.name}>Password</Label>

                          <div className="relative gap-2">
                            <Input
                              id={field.name}
                              name={field.name}
                              type={showPassword ? "text" : "password"}
                              autoComplete="new-password"
                              className="shadow-xl"
                              placeholder="Masukkan password"
                              value={field.state.value}
                              onBlur={field.handleBlur}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              onCopy={(e) => e.preventDefault()}
                              onCut={(e) => e.preventDefault()}
                              onPaste={(e) => e.preventDefault()}
                              onDragStart={(e) => e.preventDefault()}
                            />
                            <FieldError>
                              {field.state.meta.errorMap.onSubmit}
                            </FieldError>

                            <Button
                              type="button"
                              variant="ghost"
                              onClick={() => setShowPassword((prev) => !prev)}
                              className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground"
                              aria-label={
                                showPassword
                                  ? "Sembunyikan password"
                                  : "Tampilkan password"
                              }
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      )}
                    </form.Field>

                    <form.Field name="xcpass_wd">
                      {(field) => (
                        <div className="grid gap-2">
                          <Label htmlFor={field.name}>
                            Konfirmasi Password
                          </Label>

                          <div className="relative">
                            <Input
                              id={field.name}
                              name={field.name}
                              type={showConfirmPassword ? "text" : "password"}
                              value={field.state.value}
                              onBlur={field.handleBlur}
                              placeholder="Masukkan konfirmasi password"
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                            />

                            <Button
                              type="button"
                              variant="ghost"
                              onClick={() =>
                                setShowConfirmPassword((prev) => !prev)
                              }
                              className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground"
                              aria-label={
                                showPassword
                                  ? "Sembunyikan password"
                                  : "Tampilkan password"
                              }
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>

                          <FieldError>
                            {field.state.meta.errorMap.onSubmit}
                          </FieldError>
                        </div>
                      )}
                    </form.Field>
                  </FieldGroup>

                  <DialogFooter className="mt-3 flex-col-reverse gap-2 sm:flex-row">
                    <DialogClose asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full sm:w-auto"
                        onClick={handleCloseDialog}
                      >
                        Batal
                      </Button>
                    </DialogClose>

                    <Button
                      type="submit"
                      className="w-full cursor-pointer sm:w-auto"
                    >
                      Simpan
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            <Button
              variant="destructive"
              className="w-full cursor-pointer gap-2"
              onClick={handleSignOut}
            >
              <LogOut size={18} />
              Logout
            </Button>
          </div>
        </div>

        {/* USER DETAIL */}
        <div className="w-full min-w-0 overflow-hidden">
          <Table className="w-full table-fixed">
            <TableBody>
              <TableRow className="border-0">
                <TableCell className="w-[35%] px-2 py-2 font-medium sm:w-[30%] sm:px-4">
                  NIP/NIK
                </TableCell>
                <TableCell className="px-2 py-2 wrap-break-word sm:px-4">
                  {user?.nip}
                </TableCell>
              </TableRow>

              <TableRow className="border-0">
                <TableCell className="px-2 py-2 font-medium sm:px-4">
                  Kantor
                </TableCell>
                <TableCell className="px-2 py-2 wrap-break-word sm:px-4">
                  {user?.wil_code} | {user?.wil_ket?.toUpperCase()}
                </TableCell>
              </TableRow>

              <TableRow className="border-0">
                <TableCell className="px-2 py-2 font-medium sm:px-4">
                  Level User
                </TableCell>
                <TableCell className="px-2 py-2 wrap-break-word sm:px-4">
                  {user?.lv_user}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
