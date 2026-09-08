import type { AnyFieldApi } from "@tanstack/react-form"

import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"
import { getErrorMessage } from "@/lib/form-errors"

type Props = {
  field: AnyFieldApi
  label: string
  placeholder?: string
}

export function TextareaField({ field, label, placeholder }: Props) {
  const errors = field.state.meta.errors

  return (
    <Field data-invalid={errors.length > 0}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <Textarea
        id={field.name}
        className="shadow-xl"
        placeholder={placeholder}
        value={field.state.value ?? ""}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        aria-invalid={errors.length > 0}
      />
      {errors.length > 0 && (
        <FieldError>{getErrorMessage(errors[0])}</FieldError>
      )}
    </Field>
  )
}
