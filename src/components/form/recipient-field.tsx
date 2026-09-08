import { Plus, Trash2 } from "lucide-react";
import type { AnyFieldApi } from "@tanstack/react-form";

import { Button } from "@/components/ui/button";
import { ComboboxSimple } from "@/components/form/combobox-simple";
import { jenisPenerimaOptions } from "@/lib/options";
import type { Penerima } from "@/types/surat";
import { getErrorMessage } from "@/lib/form-errors";
import { FieldError } from "../ui/field";
import { API_URL } from "@/lib/env";
import type { ComboboxOption } from "./combobox-field";

type Props = {
  field: AnyFieldApi;
  label: string;
};

export function RecipientField({ field, label }: Props) {
  const rows = (field.state.value as Penerima[]) ?? [];
  const errors = field.state.meta.errors;
  const MAX_ROW = 10;
  const MIN_ROW = 1;
  const BASE_URL = `${API_URL}/surat/jenispenerima`;

  const fetchJenisPenerima = async (
    xPil: string,
  ): Promise<ComboboxOption[]> => {
    if (!xPil) return [];

    const res = await fetch(`${BASE_URL}?xPil=${encodeURIComponent(xPil)}`, {
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error("Gagal mengambil data");
    }

    const json = await res.json();

    return (json.data ?? []).map((item: any) => {
      const value = String(item.value);
      const label = String(item.label);

      return {
        value,
        label,
        displayLabel: xPil === "1" ? `${value} - ${label}` : label,
      };
    });
  };

  const addRow = () => {
    if (rows.length >= MAX_ROW) return;
    field.handleChange([...rows, { bagian: "", jabatan: "", media: "" }]);
  };

  const removeRow = (index: number) => {
    if (rows.length <= MIN_ROW) return;

    field.handleChange(rows.filter((_, i) => i !== index));
  };

  const updateRow = (index: number, patch: Partial<Penerima>) => {
    field.handleChange(
      rows.map((row, i) => (i === index ? { ...row, ...patch } : row)),
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">{label}</p>
        <Button type="button" size="sm" variant="outline" onClick={addRow}>
          <Plus className="mr-1 h-4 w-4" />
          Tambah
        </Button>
      </div>

      {rows.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Belum ada {label.toLowerCase()}.
        </p>
      )}

      {rows.map((row, index) => (
        // <div
        //   key={index}
        //   className="grid grid-cols-1 gap-3 md:grid-cols-[repeat(3,minmax(0,1fr))_10px]"
        // >
        <div
          key={index}
          className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_1fr_40px]"
        >
          <ComboboxSimple
            value={row.xPil ?? ""}
            onChange={(value) => {
              const selected = jenisPenerimaOptions.find(
                (item) => String(item.value) === String(value),
              );

              const newRow = {
                xPil: value,
                xPilValue: selected?.label ?? "",
                xTipe_penerima: "",
                xTipe_penerimaValue: "",
              };

              // console.log("NEW ROW:", newRow)

              updateRow(index, newRow);
            }}
            options={jenisPenerimaOptions}
          />

          <ComboboxSimple
            value={row.xTipe_penerima ?? ""}
            onChange={(value, option) => {
              updateRow(index, {
                xTipe_penerima: value,
                xTipe_penerimaValue: option?.label ?? value,
              });
            }}
            queryKey={["jenis-penerima", row.xPil ?? ""]}
            queryFn={() => fetchJenisPenerima(row.xPil ?? "")}
            allowCustom
            disabled={!row.xPil}
          />

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => removeRow(index)}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ))}

      {errors.length > 0 && (
        <FieldError>{getErrorMessage(errors[0])}</FieldError>
      )}
    </div>
  );
}
