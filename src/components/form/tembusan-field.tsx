import type { AnyFieldApi } from "@tanstack/react-form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Plus, Trash2 } from "lucide-react";
import type { Tembusan } from "@/types/surat";

type Props = {
  field: AnyFieldApi;
  title?: string;
  addButtonLabel?: string;
  placeholder?: string;
  maxRow?: number;
};

export function TembusanField({
  field,
  title = "Tembusan",
  addButtonLabel = "Tambah",
  placeholder = "Masukkan tembusan",
}: Props) {
  const rows = (field.state.value as Tembusan[]) ?? [];
  const MAX_ROW = 5;
  const MIN_ROW = 0;

  const addRow = () => {
    if (rows.length >= MAX_ROW) return;

    field.handleChange([
      ...rows,
      {
        tembusan: "",
      },
    ]);
  };

  const removeRow = (index: number) => {
    if (rows.length <= MIN_ROW) return;

    field.handleChange(rows.filter((_: any, i: any) => i !== index));
  };

  const updateRow = (index: number, patch: Partial<Tembusan>) => {
    field.handleChange(
      rows.map((row, i) => (i === index ? { ...row, ...patch } : row)),
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">{title}</p>

        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={addRow}
          disabled={rows.length >= MAX_ROW}
        >
          <Plus className="mr-1 h-4 w-4" />
          {addButtonLabel}
        </Button>
      </div>

      {rows.map((row: any, index: any) => {
        return (
          <div key={index} className="space-y-2">
            <div className="grid grid-cols-[1fr_20px] gap-3 md:grid-cols-[1fr_1fr_20px]">
              <Input
                placeholder={placeholder}
                value={row.tembusan_ket}
                onChange={(e) =>
                  updateRow(index, {
                    tembusan_ket: e.target.value,
                  })
                }
              />
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
    </div>
  );
}
