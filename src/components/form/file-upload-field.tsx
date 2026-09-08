import { Info, Trash2 } from "lucide-react";
import type { AnyFieldApi } from "@tanstack/react-form";

import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Props = {
  field: AnyFieldApi;
  accept?: string;
  disabled?: boolean;
};

export function FileUploadField({ field, accept, disabled = false }: Props) {
  const files = (field.state.value as File[]) ?? [];

  const removeFile = (index: number) => {
    field.handleChange(files.filter((_, i) => i !== index));
  };

  return (
    <Field>
      <FieldLabel htmlFor={field.name}>File Lampiran</FieldLabel>

      <div className="flex flex-col gap-2 md:flex-row md:items-center">
        <Input
          id={field.name}
          className="shadow-xl"
          type="file"
          multiple
          accept={accept}
          disabled={disabled}
          onChange={(e) => {
            const newFiles = e.target.files ? Array.from(e.target.files) : [];

            field.handleChange([...files, ...newFiles]);
            e.target.value = "";
          }}
        />

        <Dialog>
          <DialogTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className="shrink-0"
              disabled={disabled}
            >
              <Info className="mr-2 h-4 w-4" />
              Detail ({files.length})
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Detail Lampiran</DialogTitle>
            </DialogHeader>

            {files.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Belum ada lampiran.
              </p>
            ) : (
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div
                    key={`${file.name}-${index}`}
                    className="rounded-md border p-3 text-sm"
                  >
                    <p>
                      <strong>Nama:</strong> {file.name}
                    </p>
                    <p>
                      <strong>Ukuran:</strong> {(file.size / 1024).toFixed(2)}{" "}
                      KB
                    </p>
                    <p>
                      <strong>Tipe:</strong> {file.type || "-"}
                    </p>

                    <a
                      href={URL.createObjectURL(file)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-block text-blue-600 hover:underline dark:text-blue-400"
                    >
                      Lihat File
                    </a>
                  </div>
                ))}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
      <span className="text-sm">
        File maksimal 5Mb. Ekstensi .pdf, .xlsx, .png, .jpg
      </span>

      {files.length === 0 ? (
        <p className="text-sm text-muted-foreground">Belum ada file dipilih.</p>
      ) : (
        <ul className="space-y-1">
          {files.map((file, index) => (
            <li
              key={`${file.name}-${index}`}
              className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
            >
              <span className="truncate">{file.name}</span>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeFile(index)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </Field>
  );
}
