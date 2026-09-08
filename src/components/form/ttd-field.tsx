import { Plus, Trash2 } from "lucide-react";
import type { AnyFieldApi } from "@tanstack/react-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ComboboxSimple } from "@/components/form/combobox-simple";
import type { TandaTangan } from "@/types/surat";
import { FieldError } from "../ui/field";
import { API_URL } from "@/lib/env";

type Props = {
  field: AnyFieldApi;
  title?: string;
  addButtonLabel?: string;
  placeholder?: string;
  maxRow?: number;
};

export type ComboboxOptionTTD = {
  value: string;
  label: string;
  jabatan?: string;
};

export function TtdField({
  field,
  title = "Tanda Tangan",
  addButtonLabel = "Tambah TTD",
  placeholder = "Pilih Penandatangan",
  maxRow = 1,
}: Props) {
  const rows = (field.state.value as TandaTangan[]) ?? [];
  const BASE_URL = `${API_URL}/surat/ttd`;
  const MIN_ROW = 1;

  const addRow = () => {
    if (rows.length >= maxRow) return;

    field.handleChange([
      ...rows,
      {
        nip: "",
        jabatan: "",
      },
    ]);
  };

  const removeRow = (index: number) => {
    if (rows.length <= MIN_ROW) return;

    field.handleChange(rows.filter((_, i) => i !== index));
  };

  const updateRow = (index: number, patch: Partial<TandaTangan>) => {
    field.handleChange(
      rows.map((row, i) => (i === index ? { ...row, ...patch } : row)),
    );
  };

  const fetchTTD = async (): Promise<ComboboxOptionTTD[]> => {
    const res = await fetch(`${BASE_URL}`, { credentials: "include" });

    if (!res.ok) {
      throw new Error("Gagal mengambil data");
    }

    const json = await res.json();

    return json.data.map((item: ComboboxOptionTTD) => ({
      value: String(item.value),
      label: item.label,
      jabatan: item.jabatan,
    }));
  };

  const errors = field.state.meta.errors;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">{title}</p>

        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={addRow}
          disabled={rows.length >= maxRow}
        >
          <Plus className="mr-1 h-4 w-4" />
          {addButtonLabel}
        </Button>
      </div>

      {rows.map((row, index) => {
        const rowError =
          (errors?.[index] as {
            Xidttd?: string[];
            jabatan?: string[];
          }) ?? {};

        return (
          <div key={index} className="space-y-2">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_1fr_40px]">
              <div>
                <ComboboxSimple
                  value={row.Xidttd}
                  onChange={(value, option) => {
                    const selected = option as ComboboxOptionTTD | undefined;

                    updateRow(index, {
                      Xidttd: value,
                      label: value ? (selected?.label ?? "") : "",
                      jabatan: value ? (selected?.jabatan ?? "") : "",
                    });
                  }}
                  queryKey={["Xidttd"]}
                  queryFn={fetchTTD}
                  placeholder={placeholder}
                />

                {rowError.Xidttd?.[0] && (
                  <FieldError>{rowError.Xidttd[0]}</FieldError>
                )}
              </div>

              <div>
                <Input
                  placeholder="Nama Jabatan"
                  value={row.jabatan}
                  onChange={(e) =>
                    updateRow(index, {
                      jabatan: e.target.value,
                    })
                  }
                />

                {rowError.jabatan?.[0] && (
                  <FieldError>{rowError.jabatan[0]}</FieldError>
                )}
              </div>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeRow(index)}
                disabled={rows.length <= MIN_ROW}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>
        );
      })}

      {typeof errors?.[0] === "string" && <FieldError>{errors[0]}</FieldError>}
    </div>
  );
}
