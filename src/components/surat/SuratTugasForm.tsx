import { defaultSuratTugas } from "@/lib/defaultSuratTugas";
import { suratTugasSchema } from "@/schemas/suratTugas.schema";
import type {
  SuratTugasFormData,
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
import { DateField } from "../form/date-field";
import { TextField } from "../form/text-field";
import { TtdField } from "../form/ttd-field";
import { RecipientField } from "../form/recipient-field";
import {
  getBagianOptions,
  getBulanOptions,
  getKantorOptions,
  getKendaraanOptions,
  getKlasifikasiOptions,
  getKodeOptions,
} from "@/services/options.service";

type Props = {
  mode: SuratTugasMode;
  type: SuratTugasType;
  initialData?: SuratTugasFormData;
  onSubmit: (value: SuratTugasFormData) => Promise<void> | void;
  backTo?: string;
};

export function SuratTugasForm({
  mode,
  type,
  initialData,
  onSubmit,
  backTo = "..",
}: Props) {
  const form = useForm({
    defaultValues: initialData ?? defaultSuratTugas,
    validators: {
      onSubmit: suratTugasSchema,
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value);
    },
  });

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

                {type === "umum" && (
                  <>
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
                      <form.Field name="nomor">
                        {(field) => (
                          <TextField
                            field={field}
                            label="Nomor"
                            placeholder="001"
                            maxLength={3}
                            inputMode="numeric"
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

                    <form.Field name="pemberiTugas">
                      {(field) => (
                        <TextField
                          field={field}
                          label="Pemberi Tugas"
                          placeholder="Pemberi Tugas"
                        />
                      )}
                    </form.Field>

                    <Field>
                      <form.Field name="ttd">
                        {(field) => <TtdField field={field} maxRow={3} />}
                      </form.Field>
                    </Field>
                  </>
                )}

                {/* penerima tugas */}

                {type === "umum" && (
                  <>
                    <form.Field name="ditugaskanKe">
                      {(field) => (
                        <TextField
                          field={field}
                          label="Ditugaskan ke"
                          placeholder="Ditugaskan ke..."
                        />
                      )}
                    </form.Field>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                      <form.Field name="tglPenugasan">
                        {(field) => (
                          <DateField field={field} label="Hari/Tanggal" />
                        )}
                      </form.Field>

                      <form.Field name="pukul">
                        {(field) => (
                          <TextField field={field} label="Pukul" type="time" />
                        )}
                      </form.Field>
                    </div>

                    <form.Field name="acara">
                      {(field) => (
                        <TextField
                          field={field}
                          label="Acara/ Kegiatan"
                          placeholder="Acara/ kegiatan..."
                        />
                      )}
                    </form.Field>

                    <form.Field name="kendaraan">
                      {(field) => (
                        <ComboboxField
                          field={field}
                          label="Kendaraan"
                          options={[]}
                          queryKey={["kendaraan-options"]}
                          queryFn={getKendaraanOptions}
                          placeholder="Cari kendaraan..."
                        />
                      )}
                    </form.Field>

                    <form.Field name="klasifikasi">
                      {(field) => (
                        <ComboboxField
                          field={field}
                          label="Klasifikasi"
                          options={[]}
                          queryKey={["klasifikasi-options"]}
                          queryFn={getKlasifikasiOptions}
                          placeholder="Cari klasifikasi..."
                        />
                      )}
                    </form.Field>

                    <form.Field name="tembusan">
                      {(field) => (
                        <RecipientField field={field} label="Tembusan" />
                      )}
                    </form.Field>
                  </>
                )}
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
