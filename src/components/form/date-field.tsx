import { useState } from "react";
import { CalendarIcon } from "lucide-react";
import type { AnyFieldApi } from "@tanstack/react-form";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getErrorMessage } from "@/lib/form-errors";

function formatDate(date?: unknown) {
  if (!(date instanceof Date)) return "";

  return date.toLocaleDateString("id-ID", {
    // weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

type Props = {
  field: AnyFieldApi;
  label?: string;
  className?: string;
  minDate?: Date;
  maxDate?: Date;
};

export function DateField({
  field,
  label = "Tanggal",
  className,
  minDate,
  maxDate,
}: Props) {
  const [open, setOpen] = useState(false);
  const value = field.state.value as Date | undefined;
  const errors = field.state.meta.errors;

  return (
    <Field data-invalid={errors.length > 0} className={className}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={field.name}
            variant="outline"
            className={cn("justify-between font-normal shadow-xl", className)}
          >
            {value ? formatDate(value) : "Pilih Tanggal"}
            <CalendarIcon className="h-4 w-4 opacity-70" />
          </Button>
        </PopoverTrigger>

        <PopoverContent align="start" className="w-auto overflow-hidden p-0">
          <Calendar
            mode="single"
            selected={value}
            defaultMonth={value}
            captionLayout="dropdown"
            disabled={(date) => {
              if (minDate && date < minDate) return true;
              if (maxDate && date > maxDate) return true;
              return false;
            }}
            onSelect={(selectedDate) => {
              field.handleChange(selectedDate);
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>

      {errors.length > 0 && (
        <FieldError>{getErrorMessage(errors[0])}</FieldError>
      )}
    </Field>
  );
}
