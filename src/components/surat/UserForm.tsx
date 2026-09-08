import type { UserFormData, UserMode } from "@/types/user";
import { Button } from "../ui/button";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ListRestart, Save } from "lucide-react";
import { Card } from "../ui/card";
import { useForm } from "@tanstack/react-form";
import { Field, FieldGroup, FieldSeparator, FieldSet } from "../ui/field";
import { toast } from "sonner";
import { TextField } from "../form/text-field";
import { ComboboxField } from "../form/combobox-field";
import {
  getBagianUserOptions,
  getWilCodeOptions,
} from "@/services/options.service";
import { defaultUser } from "@/lib/defaultUser";

type Props = {
  mode: UserMode;
  initialData?: UserFormData;
  onSubmit: (value: UserFormData) => Promise<void> | void;
  backTo?: string;
  redirectAfterSubmit?: boolean;
};

export function UserFrom({
  mode,
  initialData,
  onSubmit,
  backTo = "..",
}: Props) {
  const navigate = useNavigate();
  const form = useForm({
    defaultValues: initialData ?? defaultUser,
    onSubmit: async ({ value, formApi }) => {
      try {
        await onSubmit(value);

        toast.success("Data berhasil disimpan");

        navigate({ to: "/admin/user" });
      } catch (error: any) {
        // console.log("Backend Error : ", error)
        // console.log("response error : ", error.response)

        toast.error(error?.message ?? "Terjadi kesalahan");

        const details = error.response?.error?.details ?? [];

        // console.log("Details : ", details)

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

  const title = mode === "create" ? `Tambah User` : "Edit USser";

  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl">{title}</h2>
        <Button asChild size="sm">
          <Link to={backTo} className="gap-2">
            <ArrowLeft className="size-4" />
            <span>Kembali</span>
          </Link>
        </Button>
      </div>

      <Card className="my-5 max-w-lg px-10 py-5 shadow-lg">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await form.handleSubmit();
          }}
        >
          <FieldGroup>
            <FieldSet>
              <FieldGroup>
                <form.Field name="xpass_id">
                  {(field) => (
                    <TextField
                      field={field}
                      label="Mail"
                      placeholder="example@mail.sy"
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

                <form.Field name="xpass_name">
                  {(field) => (
                    <TextField
                      field={field}
                      label="Nama"
                      placeholder="Nama pengguna"
                      maxLength={50}
                    />
                  )}
                </form.Field>

                {/* <form.Field name="xpass_wd">
                  {(field) => (
                    <TextField
                      field={field}
                      label="Password"
                      placeholder="password"
                      type="Password"
                    />
                  )}
                </form.Field> */}

                <form.Field name="xbagian">
                  {(field) => (
                    <ComboboxField
                      field={field}
                      label="Bagian"
                      options={[]}
                      queryKey={["bagian-options"]}
                      queryFn={getBagianUserOptions}
                      placeholder="Cari bagian..."
                    />
                  )}
                </form.Field>

                <form.Field name="xwil_code">
                  {(field) => (
                    <ComboboxField
                      field={field}
                      label="Wilayah"
                      options={[]}
                      queryKey={["wilcode-options"]}
                      queryFn={getWilCodeOptions}
                      placeholder="Cari wilayah..."
                    />
                  )}
                </form.Field>

                <form.Field name="xnohp">
                  {(field) => (
                    <TextField
                      field={field}
                      label="No.HP"
                      placeholder="No.Hp"
                      onlyNumber
                      maxLength={13}
                    />
                  )}
                </form.Field>
              </FieldGroup>
            </FieldSet>

            <FieldSeparator />

            <Field orientation="horizontal" className="justify-end">
              <Button
                size="sm"
                variant="outline"
                type="button"
                className="cursor-pointer shadow-lg"
                onClick={() => form.reset()}
              >
                <ListRestart className="size-4" />
                Reset
              </Button>

              <form.Subscribe selector={(state) => state.isSubmitting}>
                {(isSubmitting) => (
                  <Button
                    size="sm"
                    type="submit"
                    className="cursor-pointer items-center shadow-lg"
                    disabled={isSubmitting}
                  >
                    <Save className="size-4" />
                    {isSubmitting ? "Menyimpan..." : "Submit"}
                  </Button>
                )}
              </form.Subscribe>
            </Field>
          </FieldGroup>
        </form>
      </Card>
    </>
  );
}
