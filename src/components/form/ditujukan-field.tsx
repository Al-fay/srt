import type { Ditujukan } from "@/types/keputusan"
import type { AnyFieldApi } from "@tanstack/react-form"
import { ComboboxSimple } from "./combobox-simple"
import { bagianOptions } from "@/lib/options"
import { getDitujukanOptions } from "@/services/options.service"

type Props = {
  field: AnyFieldApi
}

export function DitujukanField({ field }: Props) {
  const value: Ditujukan = field.state.value ?? {
    type: "",
    nama: "",
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Ditunjukan</p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <ComboboxSimple
          value={value.type}
          options={[]}
          queryKey={["ditujukan-options"]}
          queryFn={getDitujukanOptions}
          placeholder="Pilih Tipe"
          onChange={(type) =>
            field.handleChange({
              ...value,
              type,
              nama: type === "Individu" ? value.nama : "",
            })
          }
        />

        <ComboboxSimple
          value={value.nama}
          options={bagianOptions}
          placeholder="Pilih Nama"
          disabled={value.type !== "Individu"}
          onChange={(nama) =>
            field.handleChange({
              ...value,
              nama,
            })
          }
        />
      </div>
    </>
  )
}
