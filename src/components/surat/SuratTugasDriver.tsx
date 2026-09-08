import { defaultSuratTugasDriver } from "@/lib/defaultSuratTugas";
import { suratTugasDriverSchema } from "@/schemas/suratTugas.schema";
import type {
  SuratTugasDriverFormData,
  SuratTugasMode,
  SuratTugasType,
} from "@/types/tugas";
import { useForm } from "@tanstack/react-form";
import { Button } from "../ui/button";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ListRestart, Save } from "lucide-react";
import { Card } from "../ui/card";
import { Field, FieldGroup, FieldSeparator, FieldSet } from "../ui/field";
import { ComboboxField } from "../form/combobox-field";
import { kantorOptions } from "@/lib/options";
import { DateField } from "../form/date-field";
import { TextField } from "../form/text-field";
import { TextareaField } from "../form/textarea-field";
import { useKlasifikasiOptions } from "@/hooks/useParameterOptions";
import { getKantorOptions } from "@/services/options.service";

type Props = {
  mode: SuratTugasMode;
  type: SuratTugasType;
  initialData?: SuratTugasDriverFormData;
  onSubmit: (value: SuratTugasDriverFormData) => Promise<void> | void;
  backTo?: string;
};

export function SuratTugasDriverForm({
  mode,
  type,
  initialData,
  onSubmit,
  backTo = "..",
}: Props) {
  const form = useForm({
    defaultValues: initialData ?? defaultSuratTugasDriver,
    validators: {
      onSubmit: suratTugasDriverSchema,
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value);
    },
  });

  const { data: klasifikasiOptions = [] } = useKlasifikasiOptions();

  const title =
    mode === "create"
      ? `Buat Surat Tugas ${type === "umum" ? "Umum" : "Driver"}`
      : `Ubah Surat Tugas ${type === "umum" ? "Umum" : "Driver"}`;

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
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <form.Field name="kantor">
                    {(field) => (
                      <ComboboxField
                        field={field}
                        label="Kantor"
                        options={[]}
                        queryKey={["kantor-options"]}
                        queryFn={getKantorOptions}
                        placeholder="Cari kantor..."
                      />
                    )}
                  </form.Field>

                  <form.Field name="tanggal">
                    {(field) => <DateField field={field} />}
                  </form.Field>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <form.Field name="pemberiTugas">
                    {(field) => (
                      <ComboboxField
                        field={field}
                        label="Pemberi Tugas"
                        options={kantorOptions}
                        placeholder="Cari pemberi tugas..."
                      />
                    )}
                  </form.Field>

                  <form.Field name="jabatan">
                    {(field) => (
                      <TextField
                        field={field}
                        label="Jabatan"
                        placeholder="Jabatan"
                      />
                    )}
                  </form.Field>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <form.Field name="tglTugas">
                    {(field) => <DateField field={field} />}
                  </form.Field>

                  <form.Field name="jamTugas">
                    {(field) => (
                      <TextField
                        field={field}
                        label="Jam Berangkat"
                        placeholder="Jam berangkat"
                        type="time"
                      />
                    )}
                  </form.Field>
                </div>

                <form.Field name="tujuan">
                  {(field) => (
                    <TextField
                      field={field}
                      label="Tujuan Kota"
                      placeholder="Tujuan Kota"
                    />
                  )}
                </form.Field>

                <form.Field name="keperluan">
                  {(field) => (
                    <TextareaField
                      field={field}
                      label="Keperluan"
                      placeholder="Keperluan tugas"
                    />
                  )}
                </form.Field>

                <form.Field name="noPol">
                  {(field) => (
                    <TextField
                      field={field}
                      label="No. Polisi Kendaraan"
                      placeholder="No. Polisi Kendaraan"
                    />
                  )}
                </form.Field>

                <form.Field name="keterangan">
                  {(field) => (
                    <TextField
                      field={field}
                      label="Keterangan"
                      placeholder="Keterangan"
                    />
                  )}
                </form.Field>

                <form.Field name="klasifikasi">
                  {(field) => (
                    <ComboboxField
                      field={field}
                      label="Klasifikasi"
                      options={klasifikasiOptions}
                      placeholder="Cari klasifikasi..."
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

              <form.Subscribe selector={(state) => state.isSubmitted}>
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
