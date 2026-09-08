import type { TandaTangan } from "@/types/keputusan"
import type { AnyFieldApi } from "@tanstack/react-form"
import { Button } from "../ui/button"
import { Plus, Trash2 } from "lucide-react"
import { Input } from "../ui/input"
import { FieldError } from "../ui/field"
import { getErrorMessage } from "@/lib/form-errors"

type Props = {
  field: AnyFieldApi
  title?: string
  addButtonLabel?: string
  placeholder?: string
}

export function MenimbangField({
  field,
  title = "Menimbang",
  addButtonLabel = "Tambah Menimbang",
  placeholder = "Masukkan Menimbang",
}: Props) {
  const rows = (field.state.value as TandaTangan[]) ?? []
  const errors = field.state.meta.errors
  const MAX_ROW = 5
  const MIN_ROW = 1

  const addRow = () => {
    if (rows.length >= MAX_ROW) return

    field.handleChange([
      ...rows,
      {
        nip: "",
        jabatan: "",
      },
    ])
  }

  const removeRow = (index: number) => {
    if (rows.length <= MIN_ROW) return

    field.handleChange(rows.filter((_, i) => i !== index))
  }

  const updateRow = (index: number, patch: Partial<TandaTangan>) =>
    field.handleChange(
      rows.map((row, i) => (i === index ? { ...row, ...patch } : row))
    )

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

      {rows.map((row, index) => (
        <div
          key={index}
          className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_1fr_40px]"
        >
          <Input
            className="shadow-xl"
            placeholder={placeholder}
            value={row.jabatan}
            onChange={(e) => updateRow(index, { jabatan: e.target.value })}
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
  )
}
