import type { TanggalLibur } from "@/types/libur"
import type { AnyFieldApi } from "@tanstack/react-form"
import { Button } from "../ui/button"
import { Plus } from "lucide-react"
// import { DateField } from "./date-field"
// import { TextField } from "./text-field"

type Props = {
  field: AnyFieldApi
  label: string
}

export default function HariLibur({ field, label }: Props) {
  const rows = (field.state.value as TanggalLibur[]) ?? []
  // const errors = field.state.meta.errors

  const addRow = () => {
    field.handleChange([rows, { tglLibur: undefined, keterangan: "" }])
  }

  // const removeRow = (index: number) => {
  //   field.handleChange(rows.filter((_, i) => i !== index))
  // }

  // const updateRow = (index: number, patch: Partial<TanggalLibur>) => {
  //   field.handleChange(
  //     rows.map((row, i) => (i === index ? { ...row, ...patch } : row))
  //   )
  // }

  return (
    <>
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

        {/* {rows.map((row, index) => (
          <div
            key={index}
            className="grid grid-cols-1 gap-3 md:grid-cols-[repeat(3,minmax(0,1fr))_40px]"
          >
            <DateField field={field} label="Tanggal" />

            <TextField field={field} label="Keterangan" />
          </div>
        ))} */}
      </div>
    </>
  )
}
