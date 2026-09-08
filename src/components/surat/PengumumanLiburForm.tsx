import { defaultPengumuman } from "@/lib/defaultPengumuman";
import type {
  PengumumanLiburFormData,
  PengumumanLiburMode,
} from "@/types/libur";
import { useForm } from "@tanstack/react-form";
import { Button } from "../ui/button";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ListRestart, Save } from "lucide-react";
import { Card } from "../ui/card";
import { Field, FieldGroup, FieldSeparator, FieldSet } from "../ui/field";
import { DateField } from "../form/date-field";
import { ComboboxField } from "../form/combobox-field";
import { TextField } from "../form/text-field";
import HariLibur from "../form/hari-libur";
import { TtdField } from "../form/ttd-field";
import {
  getBagianOptions,
  getBulanOptions,
  getKodeOptions,
} from "@/services/options.service";

type Props = {
  mode: PengumumanLiburMode;
  initialData?: PengumumanLiburFormData;
  onSubmit: (value: PengumumanLiburFormData) => Promise<void> | void;
  backTo?: string;
};

export default function PengumumanLiburForm({
  mode,
  initialData,
  onSubmit,
  backTo = "..",
}: Props) {
  const form = useForm({
    defaultValues: initialData ?? defaultPengumuman,
    validators: {
      // onSubmit:
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value);
    },
  });

  const title =
    mode === "create" ? "Buat Pengumuman Libur" : "Ubah Pengumuman Libur";

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

      <Card className="my-5 px-10 py-5 shadow-lg">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            <FieldSet>
              <FieldGroup>
                <form.Field name="tanggal">
                  {(field) => <DateField field={field} className="w-40" />}
                </form.Field>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
                  <form.Field name="nomor">
                    {(field) => (
                      <TextField
                        field={field}
                        label="Nomor"
                        placeholder="001"
                        maxLength={3}
                        onlyNumber
                      />
                    )}
                  </form.Field>

                  <form.Field name="bagian">
                    {(field) => (
                      <ComboboxField
                        field={field}
                        label="Kantor/Bagian"
                        options={[]}
                        queryKey={["bagian-options"]}
                        queryFn={getBagianOptions}
                        placeholder="Cari bagian..."
                      />
                    )}
                  </form.Field>

                  <form.Field name="kode">
                    {(field) => (
                      <ComboboxField
                        field={field}
                        label="Kode"
                        options={[]}
                        queryKey={["kode-options"]}
                        queryFn={getKodeOptions}
                        placeholder="Cari kode..."
                      />
                    )}
                  </form.Field>

                  <form.Field name="bulan">
                    {(field) => (
                      <ComboboxField
                        field={field}
                        label="Bulan"
                        options={[]}
                        queryKey={["bulan-options"]}
                        queryFn={getBulanOptions}
                        placeholder="Cari bulan..."
                      />
                    )}
                  </form.Field>
                </div>

                <form.Field name="tglLibur">
                  {(field) => <HariLibur field={field} label="Tanggal Libur" />}
                </form.Field>

                <form.Field name="buka">
                  {(field) => (
                    <DateField
                      field={field}
                      label="Tanggal Buka"
                      className="w-40"
                    />
                  )}
                </form.Field>

                <form.Field name="ttd">
                  {(field) => <TtdField field={field} maxRow={3} />}
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
