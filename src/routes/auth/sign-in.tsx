import FormAktivasi from "@/components/form-aktivasi";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePageTitle } from "@/lib/use-page-title";
import { aktivasiUser, signInService } from "@/services/auth.service";
import { useForm } from "@tanstack/react-form";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, Loader } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/auth/sign-in")({
  component: RouteComponent,
});

function RouteComponent() {
  usePageTitle("Login");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showAktivasi, setShowAktivasi] = useState(false);
  const [aktivasiData, setAktivasiData] = useState<any>(null);

  const form = useForm({
    defaultValues: {
      xpass_id: "",
      xpass_wd: "",
    },
    onSubmit: async ({ value, formApi }) => {
      try {
        const result = await signInService(value);

        if (result.data?.user?.kode === "NA") {
          setAktivasiData(result.data.user);
          setShowAktivasi(true);
          form.reset();
          return;
        }

        toast.success("Selamat Anda berhasil login");
        navigate({ to: "/" });
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
    <div className="flex min-h-screen items-center justify-center">
      <Card className="m-5 w-full max-w-sm shadow-xl">
        <CardHeader className="flex flex-col items-center space-y-1 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/30 shadow-xl dark:bg-primary">
            <svg width={56} height={56} viewBox="0 -10.5 111 111">
              <g transform="translate(-49.03 -69.142)">
                <path
                  d="M49.03,114.142a45,45,0,1,1,45,45A45,45,0,0,1,49.03,114.142Z"
                  fill="#f9d015"
                />
                <path d="M108.01,80.372v5.72h-5.72l2.83-2.83Z" fill="#59d999" />
                <path
                  d="M160.03,110.172v36.97a3,3,0,0,1-3,3h-74a3,3,0,0,1-2.839-2.031,2.8,2.8,0,0,1-.161-.949v-36.99a3,3,0,0,1,1.12-2.341l10.91-8.72V89.081a3.018,3.018,0,0,1,.87-2.119l15.96-15.941a3.018,3.018,0,0,1,2.12-.879H145a3,3,0,0,1,3,3v26.31l10.859,8.339A3.005,3.005,0,0,1,160.03,110.172Zm-6,31.5V115.311l-19.37,10.97ZM148,111.831l3.619-2.04L148,107.012ZM91.79,144.151h55.72L120.01,122.3ZM142,115.231v-39.1H114.01V89.081a3,3,0,0,1-3,3H98.06V115.5l11.921,6.979,8.21-6.359a3,3,0,0,1,3.709.02l7.7,6.12ZM108.01,86.092v-5.72l-2.89,2.89-2.83,2.83ZM86.03,141.031l18.84-14.59L86.03,115.4Zm6.03-29.05v-5.19l-3.75,3Z"
                  fill="#293a56"
                />
              </g>
            </svg>
          </div>
          <CardTitle className="text-xl">Login Sistem Surat</CardTitle>
        </CardHeader>

        <form
          id="login-form"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <CardContent>
            <div className="flex flex-col gap-2">
              <form.Field name="xpass_id">
                {(field) => (
                  <>
                    <div className="grid gap-2">
                      <Label htmlFor={field.name}>Email</Label>
                      <Input
                        id={field.name}
                        type="email"
                        placeholder="johndoe@mail.sy"
                        className="shadow-xl"
                        maxLength={50}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onCopy={(e) => e.preventDefault()}
                        onCut={(e) => e.preventDefault()}
                        onPaste={(e) => e.preventDefault()}
                        onDragStart={(e) => e.preventDefault()}
                        required
                        autoFocus
                      />
                      <FieldError>
                        {field.state.meta.errorMap.onSubmit}
                      </FieldError>
                    </div>
                  </>
                )}
              </form.Field>

              <form.Field name="xpass_wd">
                {(field) => (
                  <div className="grid gap-2">
                    <Label htmlFor={field.name}>Password</Label>

                    <div className="relative gap-2">
                      <Input
                        id={field.name}
                        type={showPassword ? "text" : "password"}
                        className="shadow-xl"
                        placeholder="Masukkan password"
                        maxLength={100}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onCopy={(e) => e.preventDefault()}
                        onCut={(e) => e.preventDefault()}
                        onPaste={(e) => e.preventDefault()}
                        onDragStart={(e) => e.preventDefault()}
                        required
                      />
                      <Button
                        type="button"
                        variant="link"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground"
                        aria-label={
                          showPassword
                            ? "Sembunyikan password"
                            : "Tampilkan password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                      <FieldError>
                        {field.state.meta.errorMap.onSubmit}
                      </FieldError>
                    </div>
                  </div>
                )}
              </form.Field>
            </div>
          </CardContent>

          <CardFooter className="mt-3">
            <form.Subscribe selector={(state) => state.isSubmitting}>
              {(isSubmitting) => (
                <Button
                  type="submit"
                  className="w-full cursor-pointer"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader className="h-5 w-5 animate-spin" />
                  ) : (
                    "Login"
                  )}
                </Button>
              )}
            </form.Subscribe>
          </CardFooter>
        </form>
      </Card>

      <div>
        {showAktivasi && (
          <FormAktivasi
            open={showAktivasi}
            initialData={{
              xpass_id: aktivasiData?.pass_id ?? "",
              xnip: aktivasiData?.nip ?? "",
              xbagian: aktivasiData?.bagian ?? "",
              xnohp: aktivasiData?.nohp ?? "",
              xpass_wd: "",
              xcpass_wd: "",
            }}
            onSubmit={async (value) => {
              await aktivasiUser(value);

              console.log(value);

              setShowAktivasi(false);
              navigate({ to: "/auth/sign-in" });
            }}
          />
        )}
      </div>
    </div>
  );
}
