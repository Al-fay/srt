import type { AnyFieldApi } from "@tanstack/react-form"
import { Button } from "../ui/button"
import { Plus, Trash2 } from "lucide-react"
import type { BarangDokumen } from "@/types/pengantar"
import { FieldError } from "../ui/field"
import { getErrorMessage } from "@/lib/form-errors"
import { Input } from "../ui/input"

type Props = {
  field: AnyFieldApi
  label: string
}

export function BarangField({ field, label }: Props) {
  const rows = (field.state.value as BarangDokumen[]) ?? []
  const errors = field.state.meta.errors
  const MAX_ROW = 3
  const MIN_ROW = 1

  const addRow = () => {
    if (rows.length >= MAX_ROW) return
    field.handleChange([...rows, { nama: "", qty: "", keterangan: "" }])
  }

  const removeRow = (index: number) => {
    if (rows.length <= MIN_ROW) return

    field.handleChange(rows.filter((_, i) => i !== index))
  }

  const updateRow = (index: number, patch: Partial<BarangDokumen>) => {
    field.handleChange(
      rows.map((row, i) => (i === index ? { ...row, ...patch } : row))
    )
  }

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
          Belum ada {label.toLocaleLowerCase()}
        </p>
      )}

      {rows.map((row, index) => (
        <div
          key={index}
          className="grid grid-cols-1 gap-3 md:grid-cols-[repeat(3,minmax(0,1fr))_40px]"
        >
          <Input
            placeholder="Nama Barang"
            value={row.nama}
            onChange={(e) =>
              updateRow(index, {
                nama: e.target.value,
              })
            }
          />

          <Input
            placeholder="QTY"
            value={row.qty}
            onChange={(e) => {
              let value = e.target.value.replace(/\D/g, "")

              updateRow(index, {
                qty: value,
              })
            }}
          />

          <Input
            placeholder="Keterangan"
            value={row.keterangan}
            onChange={(e) =>
              updateRow(index, {
                keterangan: e.target.value,
              })
            }
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
