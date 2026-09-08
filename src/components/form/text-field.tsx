import type { AnyFieldApi } from "@tanstack/react-form";
import type { HTMLAttributes } from "react";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Props = {
  field: AnyFieldApi;
  label?: string;
  placeholder?: string;
  maxLength?: number;
  defaultValue?: string;
  inputMode?: HTMLAttributes<HTMLInputElement>["inputMode"];
  className?: string;
  type?: React.HTMLInputTypeAttribute;
  onlyNumber?: boolean;
  readonly?: boolean;
};

export function TextField({
  field,
  label,
  placeholder,
  maxLength,
  inputMode,
  defaultValue,
  className,
  type = "text",
  onlyNumber = false,
  readonly = false,
}: Props) {
  const errors = [
    ...field.state.meta.errors,
    field.state.meta.errorMap?.onSubmit,
  ].filter(Boolean);

  return (
    <Field data-invalid={errors.length > 0}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>

      <Input
        id={field.name}
        type={type}
        className={cn("shadow-xl", className)}
        placeholder={placeholder}
        maxLength={maxLength}
        inputMode={inputMode}
        defaultValue={defaultValue}
        value={field.state.value ?? ""}
        onBlur={field.handleBlur}
        readOnly={readonly}
        onChange={(e) => {
          let value = e.target.value;

          if (onlyNumber) {
            value = value.replace(/\D/g, "");
          }

          field.handleChange(value);
        }}
        aria-invalid={errors.length > 0}
      />

      {errors.length > 0 && <FieldError>{String(errors[0])}</FieldError>}
    </Field>
  );
}
