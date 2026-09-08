import { defaultKeputusan } from "@/lib/defaultKeputusan";
import type {
  KeputusanMode,
  KeputusanType,
  SuratKeputusanFormData,
} from "@/types/keputusan";
import { useForm } from "@tanstack/react-form";
import { Button } from "../ui/button";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ListRestart, Save } from "lucide-react";
import { Card } from "../ui/card";
import { Field, FieldGroup, FieldSeparator, FieldSet } from "../ui/field";
import { DateField } from "../form/date-field";
import { ComboboxField } from "../form/combobox-field";
import { TextField } from "../form/text-field";
import { TextareaField } from "../form/textarea-field";
import { TtdField } from "../form/ttd-field";
import { MenimbangField } from "../form/menimbang-field";
import { DitujukanField } from "../form/ditujukan-field";
import {
  getBagianOptions,
  getBulanOptions,
  getKlasifikasiOptions,
  getKodeOptions,
} from "@/services/options.service";

type Props = {
  mode: KeputusanMode;
  type: KeputusanType;
  initialData?: SuratKeputusanFormData;
  onSubmit: (value: SuratKeputusanFormData) => Promise<void> | void;
  backTo?: string;
};

export default function SuratKeputusanForm({
  mode,
  type,
  initialData,
  onSubmit,
  backTo = "..",
}: Props) {
  const form = useForm({
    defaultValues: initialData ?? defaultKeputusan,
    validators: {
      //   onSubmit: suratSchema,
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value);
    },
  });

  const title =
    mode === "create"
      ? `Buat Surat Keputusan ${type === "produk" ? "Produk" : "Non Produk"} `
      : `Ubah Surat ${type === "produk" ? "Produk" : "Non Produk"} `;

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
                  <form.Field name="tanggal">
                    {(field) => <DateField field={field} className="w-40" />}
                  </form.Field>
                </div>

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

                <form.Field name="tentang">
                  {(field) => <TextareaField field={field} label="Tentang" />}
                </form.Field>

                {type === "nonproduk" && (
                  <form.Field name="ditunjukan">
                    {(field) => <DitujukanField field={field} />}
                  </form.Field>
                )}

                <form.Field name="menimbang">
                  {(field) => <MenimbangField field={field} />}
                </form.Field>

                <form.Field name="mengingat">
                  {(field) => (
                    <MenimbangField
                      field={field}
                      placeholder="Masukkan Mengingat"
                      title="Mengingat"
                      addButtonLabel="Tambah Mengingat"
                    />
                  )}
                </form.Field>

                <form.Field name="isi">
                  {(field) => <TextareaField field={field} label="Isi" />}
                </form.Field>

                <form.Field name="ttd">
                  {(field) => <TtdField field={field} maxRow={3} />}
                </form.Field>

                <form.Field name="mengetahui">
                  {(field) => (
                    <TtdField
                      field={field}
                      title="Mengetahui"
                      addButtonLabel="Tambah Mengetahui"
                      placeholder="Pilih Mengetahui"
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
