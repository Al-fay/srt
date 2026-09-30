import type {
  BagianForm,
  BagianGrupType,
  GetDataBagianGrupResponse,
} from "@/types/grup";
import { useForm } from "@tanstack/react-form";
import { Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { ArrowLeft, ListRestart, Save } from "lucide-react";
import { Card } from "../ui/card";
import { Field, FieldGroup, FieldSeparator, FieldSet } from "../ui/field";
import { TextField } from "../form/text-field";
import { ComboboxField } from "../form/combobox-field";
import { getDataGrupBag } from "@/services/grup.service";

type Props = {
  mode: BagianGrupType;
  initialData?: BagianForm;
  onSubmit: (value: BagianForm) => Promise<void> | void;
  backTo?: string;
};

export default function SBagianForm({
  mode,
  initialData,
  onSubmit,
  backTo = "..",
}: Props) {
  const navigate = useNavigate();
  const form = useForm({
    defaultValues: initialData ?? {
      xkode_bag: "",
      xket: "",
      xgrup: "",
    },
    onSubmit: async ({ value, formApi }) => {
      try {
        await onSubmit(value);
        toast.success("Data berhasil disimpan");
        navigate({ to: "/admin/sbagian" });
      } catch (error: any) {
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

  const title = mode === "create" ? "Tambah Bagian" : "Edit Bagian";

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
                <form.Field name="xkode_bag">
                  {(field) => (
                    <TextField
                      field={field}
                      label="Kode Bagian"
                      maxLength={3}
                      placeholder="A01"
                      className="uppercase"
                    />
                  )}
                </form.Field>
                <form.Field name="xket">
                  {(field) => (
                    <TextField
                      field={field}
                      label="Keterangan"
                      maxLength={60}
                      placeholder="Masukan Keterangan"
                    />
                  )}
                </form.Field>
                <form.Field name="xgrup">
                  {(field) => (
                    <ComboboxField<GetDataBagianGrupResponse>
                      field={field}
                      label="Grup Bagian"
                      queryKey={["grup-bagian"]}
                      queryFn={getDataGrupBag}
                      queryParams={{
                        page: 1,
                        limit: 20,
                      }}
                      mapData={(data) =>
                        data.data.map((item) => ({
                          value: String(item.grup),
                          label: item.ket_grup,
                        }))
                      }
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
