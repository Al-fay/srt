import type { TanggalLibur } from "@/types/libur";
import type { AnyFieldApi } from "@tanstack/react-form";
import { Button } from "../ui/button";
import { Plus, Trash2 } from "lucide-react";
import { DateField } from "./date-field";
import { TextField } from "./text-field";

type Props = {
  field: AnyFieldApi;
  label: string;
  maxRow?: number;
};

export default function HariLibur({ field, label, maxRow = 1 }: Props) {
  const rows = (field.state.value as TanggalLibur[]) ?? [];

  const addRow = () => {
    if (rows.length >= maxRow) return;

    field.handleChange([
      ...rows,
      {
        tglLibur: undefined,
        keterangan: "",
      },
    ]);
  };

  const removeRow = (index: number) => {
    field.handleChange(rows.filter((_, i) => i !== index));
  };

  const updateRow = (index: number, patch: Partial<TanggalLibur>) => {
    field.handleChange(
      rows.map((row, i) => (i === index ? { ...row, ...patch } : row)),
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">{label}</p>

        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={addRow}
          disabled={rows.length >= maxRow}
        >
          <Plus className="mr-1 h-4 w-4" />
          Tambah
        </Button>
      </div>

      {rows.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Belum ada {label.toLocaleLowerCase()}
        </p>
      )}

      {rows.map((row, index) => (
        <div
          key={index}
          className="grid grid-cols-1 gap-3 md:grid-cols-[repeat(2,minmax(0,1fr))_40px]"
        >
          <DateField
            field={
              {
                ...field,
                state: { ...field.state, value: row.tglLibur },
                handleChange: (value: unknown) => {
                  updateRow(index, {
                    tglLibur: value as TanggalLibur["tglLibur"],
                  });
                },
              } as unknown as AnyFieldApi
            }
            label="Tanggal"
            minDate={new Date()}
          />

          <TextField
            field={
              {
                ...field,
                state: { ...field.state, value: row.keterangan },
                handleChange: (value: unknown) => {
                  updateRow(index, { keterangan: value as string });
                },
              } as unknown as AnyFieldApi
            }
            label="Keterangan"
          />

          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="text-destructive hover:text-destructive"
            onClick={() => removeRow(index)}
            aria-label={`Hapus ${label} ${index + 1}`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}
