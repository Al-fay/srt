import { ComboboxField } from "@/components/form/combobox-field";
import { TextField } from "@/components/form/text-field";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Field,
  FieldGroup,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { getUserById, UpdateUser } from "@/services/auth.service";
import {
  getBagianUserOptions,
  getLevelUserOptions,
  getXpilOptions,
} from "@/services/options.service";
import { useForm } from "@tanstack/react-form";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/user/edit/$id")({
  loader: async ({ params }) => {
    const res = await getUserById(params.id);

    return res.data;
  },
  component: RouteComponent,
});

type FormValues = {
  xpass_id: string;
  xpil: string;
  xpass_name: string;
  xbagian: string;
  xnip: string;
  xnohp: string;
  xlevel: string;
  xpass_wd: string;
  xcpass_wd: string;
  aktiv: number;
};

function RouteComponent() {
  const navigate = useNavigate();
  const user = Route.useLoaderData();

  const form = useForm({
    defaultValues: {
      xpass_id: user.pass_id?.trim() ?? "",
      xpil: "",
      xpass_name: user.pass_name?.trim() ?? "",
      xbagian: user.bagian?.trim() ?? "",
      xnip: user.nip ?? "",
      xnohp: user.nohp?.trim() ?? "",
      xlevel: String(user.lv_user ?? ""),
      xpass_wd: "",
      xcpass_wd: "",
      aktiv: 0,
    } satisfies FormValues,
    onSubmit: async ({ value, formApi }) => {
      try {
        await UpdateUser({
          ...value,
          xpil: Number(value.xpil),
          lv_user: value.xlevel,
          aktiv: 1,
        });

        toast.success("Data berhasil disimpan");

        navigate({ to: "/admin/user" });
      } catch (error: any) {
        toast.error(error?.message ?? "Terjadi kesalahan");

        const details = error.response?.error?.details ?? [];

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
  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl">Edit User</h2>
        <Button asChild size="sm">
          <Link to="/admin/user" className="gap-2">
            <ArrowLeft className="size-4" />
            <span>Kembali</span>
          </Link>
        </Button>
      </div>

      <Card className="my-5 max-w-lg px-10 py-5 shadow-lg">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            form.handleSubmit();
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
                      readonly
                    />
                  )}
                </form.Field>

                <form.Field name="xpil">
                  {(field) => (
                    <ComboboxField
                      field={field}
                      label="Parameter Data"
                      options={[]}
                      queryKey={["xpil-options"]}
                      queryFn={getXpilOptions}
                      placeholder="Cari data..."
                    />
                  )}
                </form.Field>

                <form.Subscribe selector={(state) => state.values.xpil}>
                  {(xpil) => (
                    <>
                      {xpil === "2" && (
                        <form.Field name="xpass_name">
                          {(field) => <TextField field={field} label="Nama" />}
                        </form.Field>
                      )}

                      {xpil === "3" && (
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
                      )}

                      {xpil === "4" && (
                        <form.Field name="xnip">
                          {(field) => (
                            <TextField
                              field={field}
                              label="NIP"
                              maxLength={8}
                              onlyNumber
                            />
                          )}
                        </form.Field>
                      )}

                      {xpil === "5" && (
                        <form.Field name="xnohp">
                          {(field) => (
                            <TextField field={field} label="No. HP" />
                          )}
                        </form.Field>
                      )}

                      {xpil === "6" && (
                        <form.Field name="xlevel">
                          {(field) => (
                            <ComboboxField
                              field={field}
                              label="Level User"
                              options={[]}
                              queryKey={["level-options"]}
                              queryFn={getLevelUserOptions}
                              placeholder="Cari level..."
                            />
                          )}
                        </form.Field>
                      )}
                    </>
                  )}
                </form.Subscribe>
              </FieldGroup>

              <FieldSeparator />

              <Field orientation="horizontal" className="justify-end">
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
            </FieldSet>
          </FieldGroup>
        </form>
      </Card>
    </>
  );
}
