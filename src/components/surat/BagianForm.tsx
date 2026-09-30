import type { BagianGrupForm, BagianGrupType } from "@/types/grup";
import { Button } from "../ui/button";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ListRestart, Save } from "lucide-react";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { Card } from "../ui/card";
import { Field, FieldGroup, FieldSeparator, FieldSet } from "../ui/field";
import { TextField } from "../form/text-field";

type Props = {
  mode: BagianGrupType;
  initialData?: BagianGrupForm;
  onSubmit: (value: BagianGrupForm) => Promise<void> | void;
  backTo?: string;
};

export default function BagianForm({
  mode,
  initialData,
  onSubmit,
  backTo = "..",
}: Props) {
  const navigate = useNavigate();
  const form = useForm({
    defaultValues: initialData ?? {
      xkd_grup: 0,
      xket_grup: "",
    },
    onSubmit: async ({ value, formApi }) => {
      try {
        await onSubmit(value);

        toast.success("Data berhasil disimpan");

        navigate({ to: "/admin/bagian" });
      } catch (error: any) {
        // console.log("Backend Error : ", error);
        // console.log("response error : ", error.response);

        toast.error(error?.message ?? "Terjadi kesalahan");

        const details = error.response?.error?.details ?? [];

        // console.log("Details : ", details);

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

  const title = mode === "create" ? `Tambah Bagian Grup` : "Edit Bagian Grup";

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
                <form.Field name="xkd_grup">
                  {(field) => (
                    <TextField
                      field={field}
                      label="Kode Grup"
                      maxLength={3}
                      onlyNumber
                      placeholder="1"
                    />
                  )}
                </form.Field>
                <form.Field name="xket_grup">
                  {(field) => (
                    <TextField
                      field={field}
                      label="Keterangan Grup"
                      maxLength={50}
                      placeholder="Masukan keterangan grup"
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
