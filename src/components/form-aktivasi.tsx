import type { DataAktivasi } from "@/types/user";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { FieldError, FieldGroup } from "./ui/field";
import { useForm } from "@tanstack/react-form";
import { ComboboxField } from "./form/combobox-field";
import { getDtBagianOptions } from "@/services/auth.service";
import { Button } from "./ui/button";
import { TextField } from "./form/text-field";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Eye, EyeOff } from "lucide-react";

type Props = {
  initialData?: DataAktivasi;
  onSubmit: (value: DataAktivasi) => Promise<void> | void;
  open: boolean;
};

export default function FormAktivasi({ initialData, onSubmit, open }: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm({
    defaultValues: initialData,
    onSubmit: async ({ value, formApi }) => {
      try {
        // console.log("SUBMIT", value)

        await onSubmit(value);
        toast.success("User berhasil diverifikasi");
      } catch (error: any) {
        toast.error(error?.message ?? "Terjadi kesalahan");

        const details = error.response?.error?.details ?? [];

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

  useEffect(() => {
    if (open && initialData) {
      form.reset(initialData);
    }
  }, [open, initialData]);

  return (
    <Dialog open={open}>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          // console.log("submit form")

          await form.handleSubmit();

          // console.log("selesai submit")
        }}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Aktivasi user</DialogTitle>
            <DialogDescription>
              Silakan lengkapi data dan buat password baru untuk mengaktifkan
              akun.
            </DialogDescription>
          </DialogHeader>

          <FieldGroup>
            <form.Field name="xpass_id">
              {(field) => (
                <TextField
                  field={field}
                  label="Mail"
                  placeholder="jhondoe@mail.sy"
                />
              )}
            </form.Field>

            <form.Field name="xnip">
              {(field) => (
                <TextField
                  field={field}
                  label="NIP"
                  placeholder="NIP"
                  onlyNumber
                  maxLength={8}
                />
              )}
            </form.Field>

            <form.Field name="xpass_wd">
              {(field) => (
                <div className="grid gap-2">
                  <Label htmlFor={field.name}>Password</Label>

                  <div className="relative">
                    <Input
                      id={field.name}
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Masukkan password"
                    />

                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute inset-y-0 right-0"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>

                  <FieldError>{field.state.meta.errorMap.onSubmit}</FieldError>
                </div>
              )}
            </form.Field>

            <form.Field name="xcpass_wd">
              {(field) => (
                <div className="grid gap-2">
                  <Label htmlFor={field.name}>Konfirmasi Password</Label>

                  <div className="relative">
                    <Input
                      id={field.name}
                      type={showConfirmPassword ? "text" : "password"}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Masukkan konfirmasi password"
                    />

                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setShowConfirmPassword((v) => !v)}
                      className="absolute inset-y-0 right-0"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>

                  <FieldError>{field.state.meta.errorMap.onSubmit}</FieldError>
                </div>
              )}
            </form.Field>

            <form.Field name="xbagian">
              {(field) => (
                <ComboboxField
                  field={field}
                  label="Bagian"
                  options={[]}
                  queryKey={["bagian-options"]}
                  queryFn={getDtBagianOptions}
                  mapData={(data) => data}
                  placeholder="Cari bagian..."
                />
              )}
            </form.Field>

            <form.Field name="xnohp">
              {(field) => (
                <TextField
                  field={field}
                  label="No.HP"
                  placeholder="No.HP"
                  onlyNumber
                  maxLength={13}
                />
              )}
            </form.Field>
          </FieldGroup>

          <DialogFooter className="mt-3">
            <Button
              type="submit"
              className="w-full"
              onClick={async () => {
                await form.handleSubmit();
              }}
            >
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
