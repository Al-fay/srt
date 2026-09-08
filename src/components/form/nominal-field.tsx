import type { AnyFieldApi } from "@tanstack/react-form"
import { Input } from "../ui/input"
import { Field, FieldError, FieldLabel } from "../ui/field"
import { cn } from "@/lib/utils"
import { getErrorMessage } from "@/lib/form-errors"

function terbilang(nilai: number) {
  nilai = Math.floor(Math.abs(nilai))

  var huruf = [
    "",
    "Satu",
    "Dua",
    "Tiga",
    "Empat",
    "Lima",
    "Enam",
    "Tujuh",
    "Delapan",
    "Sembilan",
    "Sepuluh",
    "Sebelas",
  ]

  var bagi = 0
  var penyimpanan = ""

  if (nilai < 12) {
    penyimpanan = " " + huruf[nilai]
  } else if (nilai < 20) {
    penyimpanan = terbilang(Math.floor(nilai - 10)) + " Belas"
  } else if (nilai < 100) {
    bagi = Math.floor(nilai / 10)
    penyimpanan = terbilang(bagi) + " Puluh" + terbilang(nilai % 10)
  } else if (nilai < 200) {
    penyimpanan = " Seratus" + terbilang(nilai - 100)
  } else if (nilai < 1000) {
    bagi = Math.floor(nilai / 100)
    penyimpanan = terbilang(bagi) + " Ratus" + terbilang(nilai % 100)
  } else if (nilai < 2000) {
    penyimpanan = " Seribu" + terbilang(nilai - 1000)
  } else if (nilai < 1000000) {
    bagi = Math.floor(nilai / 1000)
    penyimpanan = terbilang(bagi) + " Ribu" + terbilang(nilai % 1000)
  } else if (nilai < 1000000000) {
    bagi = Math.floor(nilai / 1000000)
    penyimpanan = terbilang(bagi) + " Juta" + terbilang(nilai % 1000000)
  } else if (nilai < 1000000000000) {
    bagi = Math.floor(nilai / 1000000000)
    penyimpanan = terbilang(bagi) + " Miliar" + terbilang(nilai % 1000000000)
  } else if (nilai < 1000000000000000) {
    bagi = Math.floor(nilai / 1000000000000)
    penyimpanan =
      terbilang(nilai / 1000000000000) +
      " Triliun" +
      terbilang(nilai % 1000000000000)
  }

  return penyimpanan
}

function formatRupiah(value: string | number) {
  const number = String(value).replace(/\D/g, "")

  if (!number) return ""

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(Number(number))
}

type Props = {
  field: AnyFieldApi
  className?: string
}

export default function NominalFielD({ field, className }: Props) {
  const errors = field.state.meta.errors

  return (
    <Field data-invalid={errors.length > 0}>
      <FieldLabel>Nominal</FieldLabel>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Input
          className={cn("shadow-xl", className)}
          value={formatRupiah(field.state.value ?? "")}
          onBlur={field.handleBlur}
          onChange={(e) => {
            const rawValue = e.target.value.replace(/\D/g, "")
            field.handleChange(rawValue)
          }}
          aria-invalid={errors.length > 0}
        />

        <Input
          className={cn("shadow-xl", className)}
          value={
            field.state.value
              ? terbilang(Number(field.state.value.replace(/\D/g, ""))).trim()
              : ""
          }
          readOnly
        />
      </div>

      {errors.length > 0 && (
        <FieldError>{getErrorMessage(errors[0])}</FieldError>
      )}
    </Field>
  )
}
