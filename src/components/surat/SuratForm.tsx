import { useForm } from "@tanstack/react-form";
import { useEffect, useState } from "react";
import { Eye, FilePenLine, ListRestart, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { TextField } from "@/components/form/text-field";
import { ComboboxField } from "@/components/form/combobox-field";
import { DateField } from "@/components/form/date-field";
import { EditorField } from "@/components/form/editor-field";
import { FileUploadField } from "@/components/form/file-upload-field";
import { RecipientField } from "@/components/form/recipient-field";
import { TtdField } from "@/components/form/ttd-field";
import { defaultSurat } from "@/lib/defaultSurat";
import type { SuratFormData, SuratMode, SuratType } from "@/types/surat";
import {
  getBagianOptions,
  getBulanOptions,
  getKlasifikasiOptions,
  getKodeOptions,
  getKotaOptions,
  getSatuanOptions,
} from "@/services/options.service";
import { toast } from "sonner";
import type { ApiThrownError } from "@/types/api";
import { SuratKeluarPreview } from "../preview/skeluar-preview";
import { useQuery } from "@tanstack/react-query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { useNavigate } from "@tanstack/react-router";
import { TembusanField } from "../form/tembusan-field";
import { TextareaField } from "../form/textarea-field";
import { meService } from "@/services/auth.service";

type Props = {
  mode: SuratMode;
  type: SuratType;
  initialData?: SuratFormData;
  onSubmit: (value: SuratFormData) => Promise<void> | void;
  redirectAfterSubmit?: boolean;
};

export function SuratForm({ mode, type, initialData, onSubmit }: Props) {
  const [showPreview, setShowPreview] = useState(false);
  const navigate = useNavigate();
  const form = useForm({
    defaultValues: initialData ?? defaultSurat,

    onSubmit: async ({ value, formApi }) => {
      try {
        await onSubmit(value);

        toast.success("Data berhasil disimpan");

        form.reset();

        navigate({ to: "/arsip-surat-keluar/" });
      } catch (e) {
        const error = e as ApiThrownError;

        toast.error(error.message);

        const details = error.response?.error?.details ?? [];

        const fieldMap: Record<string, string> = {
          "surat.xJml_ttd": "ttd",
        };

        details.forEach((item: any) => {
          const fieldName = fieldMap[item.field] ?? item.field;

          const field = formApi.getFieldInfo(fieldName as any)?.instance;

          if (!field) {
            console.warn(`Field "${fieldName}" tidak ditemukan`);
            return;
          }

          field.setMeta((prev) => ({
            ...(prev ?? {}),
            errorMap: {
              ...(prev?.errorMap ?? {}),
              onSubmit: item.message,
            },
          }));
        });
      }
    },
  });

  const { data: me } = useQuery({
    queryKey: ["me"],
    queryFn: meService,
  });

  useEffect(() => {
    if (me?.data?.wil_code && !initialData?.surat?.xKota) {
      form.setFieldValue("surat.xKota", me?.data?.wil_code);
    }
  }, [me?.data?.wil_code, initialData?.surat?.xKota, form]);

  const { data: kotaOptions = [] } = useQuery({
    queryKey: ["kantor-options"],
    queryFn: getKotaOptions,
  });

  const { data: klasifikasiOptions = [] } = useQuery({
    queryKey: ["klasifikasi-options"],
    queryFn: getKlasifikasiOptions,
  });

  const title =
    mode === "create"
      ? `Buat Surat Keluar ${type === "internal" ? "Internal" : "Eksternal"}`
      : `Ubah Surat Keluar ${type === "internal" ? "Internal" : "Eksternal"}`;

  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl">{title}</h2>
      </div>

      <div className="my-5">
        {!showPreview ? (
          <Card className="w-full px-10 py-5 shadow-lg">
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await form.handleSubmit();
              }}
            >
              <FieldGroup>
                <FieldSet>
                  <FieldGroup>
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                      <form.Field name="surat.xKota">
                        {(field) => (
                          <ComboboxField
                            field={field}
                            label="Kota (Pembuatan surat)"
                            options={[]}
                            readonly
                            queryKey={["kantor-options"]}
                            queryFn={getKotaOptions}
                            placeholder="Cari kantor..."
                          />
                        )}
                      </form.Field>

                      <form.Field name="surat.xNo_thn">
                        {(field) => <DateField field={field} />}
                      </form.Field>
                    </div>

                    {/* {type === "internal" && ( */}
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                      {/* <form.Field name="nomor">
                    {(field) => (
                      <TextField
                        field={field}
                        label="Nomor"
                        placeholder="001"
                        maxLength={3}
                        onlyNumber
                      />
                    )}
                  </form.Field> */}

                      <form.Field name="surat.xNo_bag">
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

                      <form.Field name="surat.xNo_kode">
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

                      <form.Field name="surat.xNo_bln">
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
                    {/* )} */}

                    <form.Field name="surat.xHal">
                      {(field) => (
                        <TextField
                          field={field}
                          label="Perihal"
                          maxLength={100}
                          placeholder="Perihal Surat"
                        />
                      )}
                    </form.Field>

                    <Field>
                      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                        <form.Field name="surat.jumlahLampiran">
                          {(field) => (
                            <TextField
                              field={field}
                              label="Jumlah Lampiran"
                              placeholder="Jumlah Lampiran"
                              onlyNumber={true}
                              maxLength={2}
                            />
                          )}
                        </form.Field>

                        <form.Subscribe
                          selector={(state) =>
                            state.values.surat.jumlahLampiran
                          }
                        >
                          {(jumlahLampiran) => {
                            return jumlahLampiran != "" &&
                              jumlahLampiran != "0" &&
                              jumlahLampiran != "00" ? (
                              <>
                                <form.Field name="surat.ket_lampiran">
                                  {(field) => (
                                    <ComboboxField
                                      field={field}
                                      label="Satuan"
                                      options={[]}
                                      queryKey={["satuan-options"]}
                                      queryFn={getSatuanOptions}
                                      placeholder="Cari satuan..."
                                    />
                                  )}
                                </form.Field>

                                <form.Field name="lampiran">
                                  {(field) => (
                                    <FileUploadField
                                      field={field}
                                      accept="application/pdf,.xlsx,image/png,image/jpeg"
                                      disabled={
                                        Number(
                                          form.getFieldValue(
                                            "surat.jumlahLampiran",
                                          ) ?? 0,
                                        ) <= 0
                                      }
                                    />
                                  )}
                                </form.Field>
                              </>
                            ) : null;
                          }}
                        </form.Subscribe>
                      </div>
                    </Field>

                    <form.Field name="surat.xKepada">
                      {(field) => (
                        <RecipientField field={field} label="Kepada" />
                      )}
                    </form.Field>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                      <form.Field name="surat.kepada2">
                        {(field) => (
                          <TextareaField field={field} label="Alamat" />
                        )}
                      </form.Field>

                      <span className="font-bold">
                        Struktur alamat tidak boleh diubah
                      </span>
                    </div>

                    {/* <form.Field name="alamat">
                  {(field) => (
                    <TextareaField
                      field={field}
                      label="Alamat"
                      placeholder="Alamat Surat"
                    />
                  )}
                </form.Field> */}

                    <Field>
                      <FieldLabel>Isi Surat</FieldLabel>
                      <form.Field name="surat.xIsi">
                        {(field) => <EditorField field={field} />}
                      </form.Field>
                    </Field>

                    {/* <form.Field name="penutup">
                  {(field) => (
                    <TextareaField
                      field={field}
                      label="Paragraf Penutup"
                      placeholder="Paragraf penutup surat"
                    />
                  )}
                </form.Field> */}

                    <Field>
                      <form.Field name="ttd">
                        {(field) => <TtdField field={field} maxRow={3} />}
                      </form.Field>
                    </Field>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                      <form.Field name="surat.klasifikasi">
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

                      <form.Subscribe
                        selector={(state) => state.values.surat.klasifikasi}
                      >
                        {(klasifikasi) => {
                          useEffect(() => {
                            if (klasifikasi === "1") {
                              form.setFieldValue("surat.xTg_share", undefined);
                            }
                          }, [klasifikasi]);

                          return klasifikasi === "1" ? (
                            <form.Field name="surat.xTg_share">
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

                    {/* <form.Field name="surat.tembusan">
                      {(field) => (
                        <RecipientField field={field} label="Tembusan" />
                      )}
                    </form.Field> */}

                    <form.Field name="surat.tembusan_ket">
                      {(field) => <TembusanField field={field} />}
                    </form.Field>
                  </FieldGroup>
                </FieldSet>

                <FieldSeparator />

                <Field orientation="horizontal" className="justify-end">
                  <Button
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
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            type="button"
                            className="cursor-pointer"
                            disabled={isSubmitting}
                          >
                            <Save className="size-4" />
                            Submit
                          </Button>
                        </AlertDialogTrigger>

                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Konfirmasi</AlertDialogTitle>

                            <AlertDialogDescription>
                              Yakin ingin menyimpan data?
                              <strong>
                                {" "}
                                Data yang sudah disimpan tidak bisa diubah.
                              </strong>
                            </AlertDialogDescription>
                          </AlertDialogHeader>

                          <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>

                            <AlertDialogAction
                              type="button"
                              disabled={isSubmitting}
                              onClick={() => form.handleSubmit()}
                            >
                              <Save className="size-4" />
                              {isSubmitting ? "Menyimpan..." : "Submit"}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      // <Button
                      //   size="sm"
                      //   type="submit"
                      //   className="cursor-pointer items-center shadow-lg"
                      //   disabled={isSubmitting}
                      // >
                      //   <Save className="size-4" />
                      //   {isSubmitting ? "Menyimpan..." : "Submit"}
                      // </Button>
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
                <SuratKeluarPreview
                  data={values}
                  visible
                  kotaOptions={kotaOptions}
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
      </div>
    </>
  );
}
