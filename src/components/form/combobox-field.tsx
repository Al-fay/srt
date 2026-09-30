import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import type { AnyFieldApi } from "@tanstack/react-form";
import { useQuery } from "@tanstack/react-query";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import type { DataTableQueryParams } from "../data-table";

export type ComboboxOption = {
  value: string;
  label: string;
  displayLabel?: string;
};

type Props<TData> = {
  field: AnyFieldApi;
  label: string;
  options?: ComboboxOption[];
  placeholder?: string;
  defaultValue?: string;
  onValueChange?: (option: ComboboxOption | null) => void;
  queryKey?: string[];
  queryFn?: (params?: Partial<DataTableQueryParams>) => Promise<TData>;
  queryParams?: Partial<DataTableQueryParams>;
  mapData?: (data: TData) => ComboboxOption[];
  readonly?: boolean;
};

export function ComboboxField<TData>({
  field,
  label,
  options,
  readonly,
  placeholder = "Cari...",
  defaultValue,
  onValueChange,
  queryKey,
  queryFn,
  queryParams,
  mapData,
}: Props<TData>) {
  const [open, setOpen] = useState(false);

  const { data, error, isError } = useQuery({
    queryKey: [...(queryKey ?? []), queryParams],
    queryFn: () => queryFn!(queryParams),
    enabled: !!queryFn && (open || !!field.state.value || !!defaultValue),
    staleTime: Infinity,
    retry: false,
  });

  const finalOptions: ComboboxOption[] = (() => {
    if (queryFn && data) {
      if (mapData) {
        return mapData(data);
      }

      if (Array.isArray(data)) {
        return data as ComboboxOption[];
      }
    }

    return options ?? [];
  })();

  const value = (field.state.value as string) || defaultValue || "";

  const errors = [
    ...field.state.meta.errors,
    field.state.meta.errorMap?.onSubmit,
  ].filter(Boolean);

  const selected = finalOptions.find((option) => option.value === value);

  return (
    <Field data-invalid={errors.length > 0}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={field.name}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={readonly}
            className="w-full justify-between"
            onBlur={field.handleBlur}
          >
            <span className="truncate text-left">
              {selected
                ? (selected.displayLabel ?? selected.label)
                : placeholder}
            </span>

            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        {!readonly && (
          <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
            <Command>
              <CommandInput placeholder={placeholder} />

              <CommandList>
                <CommandEmpty>
                  {isError
                    ? error instanceof Error
                      ? error.message
                      : "Terjadi kesalahan"
                    : "Tidak ada data"}
                </CommandEmpty>

                <ScrollArea className="h-32">
                  <CommandGroup>
                    {finalOptions.map((option) => (
                      <CommandItem
                        key={option.value}
                        value={option.label}
                        keywords={[option.label, option.displayLabel ?? ""]}
                        onSelect={() => {
                          const selectedOption =
                            option.value === value ? null : option;

                          field.handleChange(selectedOption?.value ?? "");

                          onValueChange?.(selectedOption);

                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            value === option.value
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />

                        {option.displayLabel ?? option.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>

                  <ScrollBar
                    orientation="vertical"
                    className="rounded-md bg-background"
                  />
                </ScrollArea>
              </CommandList>
            </Command>
          </PopoverContent>
        )}
      </Popover>

      {errors.length > 0 && <FieldError>{String(errors[0])}</FieldError>}
    </Field>
  );
}
