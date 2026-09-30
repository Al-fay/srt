import { ComboboxField } from "@/components/form/combobox-field";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { usePageTitle } from "@/lib/use-page-title";
import {
  displayUserGrupService,
  displayUserService,
  getJenisPenerima,
} from "@/services/display.service";
import {
  getStsUserOptions,
  getWilCodeOptions,
} from "@/services/options.service";
import { useForm } from "@tanstack/react-form";
import { createFileRoute } from "@tanstack/react-router";
import { Loader } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/display/")({
  component: RouteComponent,
});

function RouteComponent() {
  usePageTitle("Display User");
  const form = useForm({
    defaultValues: {
      xwil_code: "",
      xwil_name: "",
      xaktiv: "",
    },
  });

  const formGrup = useForm({
    defaultValues: {
      xgrup: "",
      xposisi: "",
    },
  });

  const [previewLoading, setPreviewLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);

  const [previewGrupLoading, setPreviewGrupLoading] = useState(false);
  const [downloadGrupLoading, setDownloadGrupLoading] = useState(false);

  const handlePreview = async () => {
    try {
      setPreviewLoading(true);
      const value = form.state.values;

      const blob = await displayUserService(value);

      const url = URL.createObjectURL(blob);

      window.open(url, "_blank");

      form.reset();
    } catch (error: any) {
      //   console.log("Backend Error ", error)
      //   console.log("Response Error ", error.response)

      toast.error(error?.message ?? "Terjadi kesalahan");

      const details = error.response?.error?.details ?? [];

      //   console.log("Details error ", details)

      details.forEach((item: any) => {
        const field = form.getFieldInfo(item.field)?.instance;

        if (!field) return;

        field.setMeta((prev) => ({
          ...(prev ?? {}),
          errorMap: {
            ...(prev?.errorMap ?? {}),
            onSubmit: item.message,
          },
        }));
      });
    } finally {
      setPreviewLoading(false);
    }
  };

  const handlePreviewGrup = async () => {
    try {
      setPreviewGrupLoading(true);
      const value = formGrup.state.values;

      const blob = await displayUserGrupService(value);

      const url = URL.createObjectURL(blob);

      window.open(url, "_blank");

      formGrup.reset();
    } catch (error: any) {
      // console.log("Backend Error ", error)
      // console.log("Response Error ", error.response)

      toast.error(error?.message ?? "Terjadi kesalahan");

      const details = error.response?.error?.details ?? [];

      // console.log("Details error ", details)

      details.forEach((item: any) => {
        const field = formGrup.getFieldInfo(item.field)?.instance;

        if (!field) return;

        field.setMeta((prev) => ({
          ...(prev ?? {}),
          errorMap: {
            ...(prev?.errorMap ?? {}),
            onSubmit: item.message,
          },
        }));
      });
    } finally {
      setPreviewGrupLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      setDownloadLoading(true);

      const value = form.state.values;

      const blob = await displayUserService(value);

      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `display-user-${value.xwil_name}-${new Date()
        .toISOString()
        .slice(0, 10)}.pdf`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(url);
      form.reset();
    } catch (error: any) {
      //   console.log("Backend Error ", error)
      //   console.log("Response Error ", error.response)

      toast.error(error?.message ?? "Terjadi kesalahan");

      const details = error.response?.error?.details ?? [];
      //   console.log("response", error.response)
      //   console.log("error", error.response?.error)
      //   console.log("details", error.response?.error?.details)

      //   console.log("Details error ", details)

      details.forEach((item: any) => {
        const field = form.getFieldInfo(item.field)?.instance;

        if (!field) return;

        field.setMeta((prev) => ({
          ...(prev ?? {}),
          errorMap: {
            ...(prev?.errorMap ?? {}),
            onSubmit: item.message,
          },
        }));
      });
    } finally {
      setDownloadLoading(false);
    }
  };

  const handleDownloadGrup = async () => {
    try {
      setDownloadGrupLoading(true);
      const value = formGrup.state.values;

      const blob = await displayUserGrupService(value);

      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `display-user-posisi-${value.xposisi}-${new Date().toISOString().slice(0, 10)}.pdf`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(url);
      formGrup.reset();
    } catch (error: any) {
      // console.log("Backend Error ", error)
      // console.log("Response Error ", error.response)

      toast.error(error?.message ?? "Terjadi kesalahan");

      const details = error.response?.error?.details ?? [];
      // console.log("response", error.response)
      // console.log("error", error.response?.error)
      // console.log("details", error.response?.error?.details)

      // console.log("Details error ", details)

      details.forEach((item: any) => {
        const field = formGrup.getFieldInfo(item.field)?.instance;

        if (!field) return;

        field.setMeta((prev) => ({
          ...(prev ?? {}),
          errorMap: {
            ...(prev?.errorMap ?? {}),
            onSubmit: item.message,
          },
        }));
      });
    } finally {
      setDownloadGrupLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Display User Berdasarkan Kantor</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <form.Field name="xwil_code">
              {(field) => (
                <ComboboxField
                  field={field}
                  label="Wilayah"
                  options={[]}
                  queryKey={["xwil_code-options"]}
                  queryFn={getWilCodeOptions}
                  mapData={(data) => data}
                  placeholder="Cari wilayah..."
                  onValueChange={(option) => {
                    form.setFieldValue("xwil_name", option?.label ?? "");
                  }}
                />
              )}
            </form.Field>

            <form.Field name="xaktiv">
              {(field) => (
                <ComboboxField
                  field={field}
                  label="Status User"
                  options={[]}
                  queryKey={["xaktiv-options"]}
                  queryFn={getStsUserOptions}
                  mapData={(data) => data}
                  placeholder="Cari status..."
                />
              )}
            </form.Field>
          </form>
        </CardContent>
        <CardFooter className="flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handlePreview}
            className="cursor-pointer"
          >
            {previewLoading ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : (
              "Preview"
            )}
          </Button>

          <Button
            type="button"
            onClick={handleDownload}
            className="cursor-pointer"
          >
            {downloadLoading ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : (
              "Unduh"
            )}
          </Button>
        </CardFooter>
      </Card>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Display User Berdasarkan Posisi</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              formGrup.handleSubmit();
            }}
          >
            <formGrup.Field name="xgrup">
              {(field) => (
                <ComboboxField
                  field={field}
                  label="Bagian"
                  options={[]}
                  queryKey={["xgrup-options"]}
                  queryFn={getJenisPenerima}
                  mapData={(data) => data}
                  placeholder="Cari bagian..."
                  onValueChange={(option) => {
                    formGrup.setFieldValue("xgrup", option?.value ?? "");
                    formGrup.setFieldValue("xposisi", option?.label ?? "");
                  }}
                />
              )}
            </formGrup.Field>
          </form>
        </CardContent>
        <CardFooter className="flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handlePreviewGrup}
            className="cursor-pointer"
          >
            {previewGrupLoading ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : (
              "Preview"
            )}
          </Button>

          <Button
            type="button"
            onClick={handleDownloadGrup}
            className="cursor-pointer"
          >
            {downloadGrupLoading ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : (
              "Unduh"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
