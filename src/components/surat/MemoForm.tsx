import { defaultMemo } from "@/lib/defaultMemo";
import type { MemoFormData, MemoMode } from "@/types/memo";
import { useForm } from "@tanstack/react-form";
import { Button } from "../ui/button";
import { ListRestart, Save } from "lucide-react";
import { Card } from "../ui/card";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  FieldSet,
} from "../ui/field";
import { ComboboxField } from "../form/combobox-field";
import { DateField } from "../form/date-field";
import { TextField } from "../form/text-field";
import { TtdField } from "../form/ttd-field";
import { EditorField } from "../form/editor-field";
import { FileUploadField } from "../form/file-upload-field";
import {
  getBagianOptions,
  getBulanOptions,
  getKantorOptions,
  getKlasifikasiOptions,
  getKodeOptions,
} from "@/services/options.service";
import { RecipientField } from "../form/recipient-field";
import { useQuery } from "@tanstack/react-query";
import { meService } from "@/services/auth.service";
import { useEffect } from "react";

type Props = {
  mode: MemoMode;
  initialData?: MemoFormData;
  onSubmit: (value: MemoFormData) => Promise<void> | void;
  backTo?: string;
};

export default function MemoForm({ mode, initialData, onSubmit }: Props) {
  const form = useForm({
    defaultValues: initialData ?? defaultMemo,
    validators: {
      // onSubmit: suratSchema,
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value);
    },
  });

  const { data: me } = useQuery({
    queryKey: ["me"],
    queryFn: meService,
  });

  useEffect(() => {
    if (me?.data?.wil_code && !initialData?.kantor) {
      form.setFieldValue("kantor", me?.data?.wil_code);
    }
  }, [me?.data?.wil_code, initialData?.kantor, form]);

  const title = mode === "create" ? "Buat Memo" : "Ubah Memo";

  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl">{title}</h2>
      </div>

      <Card className="my-5 px-10 py-5 shadow-lg">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation;
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
                        label="Kota (Pembuatan surat)"
                        options={[]}
                        queryKey={["kantor-options"]}
                        queryFn={getKantorOptions}
                        mapData={(data) => data}
                        placeholder="Cari kantor..."
                        readonly
                      />
                    )}
                  </form.Field>

                  <form.Field name="tanggal">
                    {(field) => <DateField field={field} />}
                  </form.Field>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                  <form.Field name="bagian">
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

                  <form.Field name="kode">
                    {(field) => (
                      <ComboboxField
                        field={field}
                        label="Kode"
                        options={[]}
                        queryKey={["kode-options"]}
                        queryFn={getKodeOptions}
                        mapData={(data) => data}
                        placeholder="Cari kode..."
                        defaultValue="H"
                        readonly
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
                        mapData={(data) => data}
                        placeholder="Cari bulan..."
                      />
                    )}
                  </form.Field>
                </div>

                <form.Field name="memoDari">
                  {(field) => (
                    <TextField
                      field={field}
                      label="Memo Dari"
                      placeholder="Memo dari..."
                    />
                  )}
                </form.Field>

                <form.Field name="ttd">
                  {(field) => <TtdField field={field} maxRow={3} />}
                </form.Field>

                <form.Field name="penerima">
                  {(field) => (
                    <RecipientField label="Penerima Memo" field={field} />
                  )}
                </form.Field>

                <form.Field name="perihal">
                  {(field) => (
                    <TextField
                      field={field}
                      label="Perihal"
                      placeholder="Perihal..."
                    />
                  )}
                </form.Field>

                <Field>
                  <FieldLabel>Isi Surat</FieldLabel>
                  <form.Field name="isi">
                    {(field) => <EditorField field={field} />}
                  </form.Field>
                </Field>

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

                <form.Field name="lampiran">
                  {(field) => <FileUploadField field={field} />}
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
