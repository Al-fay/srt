import { defaultPengumuman } from "@/lib/defaultPengumuman";
import type {
  PengumumanLiburFormData,
  PengumumanLiburMode,
} from "@/types/libur";
import { useForm } from "@tanstack/react-form";
import { Button } from "../ui/button";
import { Eye, FilePenLine, ListRestart, Save } from "lucide-react";
import { Card } from "../ui/card";
import { Field, FieldGroup, FieldSeparator, FieldSet } from "../ui/field";
import { DateField } from "../form/date-field";
import { ComboboxField } from "../form/combobox-field";
import HariLibur from "../form/hari-libur";
import { TtdField } from "../form/ttd-field";
import {
  getBagianOptions,
  getBulanOptions,
  getKlasifikasiOptions,
  getKodeOptions,
} from "@/services/options.service";
import { useEffect, useState } from "react";
import { HariLiburPreview } from "../preview/libur-preview";
import { useQuery } from "@tanstack/react-query";

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
}: Props) {
  const [showPreview, setShowPreview] = useState(false);
  const form = useForm({
    defaultValues: initialData ?? defaultPengumuman,
    validators: {
      // onSubmit:
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value);
    },
  });

  const { data: klasifikasiOptions = [] } = useQuery({
    queryKey: ["klasifikasi-options"],
    queryFn: getKlasifikasiOptions,
  });

  const title =
    mode === "create" ? "Buat Pengumuman Libur" : "Ubah Pengumuman Libur";

  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl">{title}</h2>
      </div>

      {!showPreview ? (
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
                  <form.Field name="xNo_thn">
                    {(field) => <DateField field={field} className="w-60" />}
                  </form.Field>

                  <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                    <form.Field name="xNo_bag">
                      {(field) => (
                        <ComboboxField
                          field={field}
                          label="Kantor/Bagian"
                          options={[]}
                          queryKey={["bagian-options"]}
                          queryFn={getBagianOptions}
                          mapData={(data) => data}
                          placeholder="Cari bagian..."
                        />
                      )}
                    </form.Field>

                    <form.Field name="xNo_kode">
                      {(field) => (
                        <ComboboxField
                          field={field}
                          label="Kode"
                          options={[]}
                          queryKey={["kode-options"]}
                          queryFn={getKodeOptions}
                          mapData={(data) => data}
                          placeholder="Cari kode..."
                          defaultValue="G"
                          readonly
                        />
                      )}
                    </form.Field>

                    <form.Field name="xNo_bln">
                      {(field) => (
                        <ComboboxField
                          field={field}
                          label="Bulan"
                          options={[]}
                          queryKey={["bulan-options"]}
                          queryFn={getBulanOptions}
                          mapData={(data) => data}
                          placeholder="Cari bulan..."
                        />
                      )}
                    </form.Field>
                  </div>

                  <form.Field name="tglLibur">
                    {(field) => (
                      <HariLibur field={field} label="Hari Libur" maxRow={10} />
                    )}
                  </form.Field>

                  <form.Field name="buka">
                    {(field) => (
                      <DateField
                        field={field}
                        label="Buka Kembali"
                        className="w-60"
                        minDate={new Date()}
                      />
                    )}
                  </form.Field>

                  <form.Field name="ttd">
                    {(field) => <TtdField field={field} maxRow={1} />}
                  </form.Field>

                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <form.Field name="klasifikasi">
                      {(field) => (
                        <ComboboxField
                          field={field}
                          label="Klasifikasi"
                          options={[]}
                          queryKey={["klasifikasi-options"]}
                          queryFn={getKlasifikasiOptions}
                          mapData={(data) => data}
                          placeholder="Cari klasifikasi..."
                        />
                      )}
                    </form.Field>

                    <form.Subscribe
                      selector={(state) => state.values.klasifikasi}
                    >
                      {(klasifikasi) => {
                        useEffect(() => {
                          if (klasifikasi === "1") {
                            form.setFieldValue("xTg_share", undefined);
                          }
                        }, [klasifikasi]);

                        return klasifikasi === "1" ? (
                          <form.Field name="xTg_share">
                            {(field) => (
                              <DateField
                                field={field}
                                label="Sharing Tgl. Mulai"
                                minDate={new Date()}
                              />
                            )}
                          </form.Field>
                        ) : null;
                      }}
                    </form.Subscribe>
                  </div>
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
      ) : (
        <div className="w-full">
          <form.Subscribe selector={(state) => state.values}>
            {(values) => (
              <HariLiburPreview
                data={values}
                visible
                klasifikasiOptions={klasifikasiOptions}
              />
            )}
          </form.Subscribe>
        </div>
      )}

      <Button
        type="button"
        variant="secondary"
        size="sm"
        className="gap-2 mt-3"
        onClick={() => setShowPreview((prev) => !prev)}
      >
        {showPreview ? (
          <>
            <FilePenLine className="size-4" />
            Tampilkan Form
          </>
        ) : (
          <>
            <Eye className="size-4" />
            Preview
          </>
        )}
      </Button>
    </>
  );
}
