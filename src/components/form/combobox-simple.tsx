import { useState } from "react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
import type { ComboboxOption } from "@/components/form/combobox-field";
import { useQuery } from "@tanstack/react-query";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";

type Props = {
  value: string;
  onChange: (value: string, option?: ComboboxOption) => void;
  options?: ComboboxOption[];
  placeholder?: string;
  disabled?: boolean;
  queryKey?: string[];
  queryFn?: () => Promise<ComboboxOption[]>;
  allowCustom?: boolean;
};

export function ComboboxSimple({
  value,
  onChange,
  options,
  placeholder = "Cari...",
  disabled = false,
  queryKey,
  queryFn,
  allowCustom = false,
}: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const {
    data = [],
    error,
    isError,
  } = useQuery({
    queryKey: queryKey ?? [],
    queryFn: queryFn ?? (() => Promise.resolve([])),
    enabled: open && !!queryFn,
    staleTime: Infinity,
    retry: false,
  });

  const finalOptions = queryFn ? data : (options ?? []);

  const selected = finalOptions.find(
    (option) => String(option.value) === String(value),
  );

  const searchValue = search.trim();

  const hasExactMatch = finalOptions.some(
    (option) => option.label.toLowerCase() === searchValue.toLowerCase(),
  );

  const customOption: ComboboxOption | undefined =
    allowCustom && searchValue && !hasExactMatch
      ? {
          value: searchValue,
          label: searchValue,
        }
      : undefined;

  return (
    <Popover
      open={disabled ? false : open}
      onOpenChange={(nextOpen) => {
        if (!disabled) {
          setOpen(nextOpen);

          if (!nextOpen) {
            setSearch("");
          }
        }
      }}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className="w-full justify-between shadow-xl"
        >
          <span className="truncate text-left">
            {selected
              ? (selected.displayLabel ?? selected.label)
              : value || placeholder}
          </span>

          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput
            placeholder={placeholder}
            disabled={disabled}
            value={search}
            onValueChange={setSearch}
          />

          <CommandList>
            {isError ? (
              <CommandEmpty className="whitespace-pre-line">
                {error instanceof Error ? error.message : "Terjadi kesalahan"}
              </CommandEmpty>
            ) : (
              <>
                {finalOptions.length === 0 && !customOption && (
                  <CommandEmpty>Tidak ada data</CommandEmpty>
                )}

                {customOption && (
                  <CommandGroup heading="Input manual">
                    <CommandItem
                      value={`custom-${customOption.value}`}
                      onSelect={() => {
                        onChange(customOption.value, customOption);

                        setOpen(false);
                        setSearch("");
                      }}
                    >
                      <Plus className="mr-2 h-4 w-4" />

                      <span>
                        Gunakan: <strong>{customOption.label}</strong>
                      </span>
                    </CommandItem>
                  </CommandGroup>
                )}

                <ScrollArea className="h-32">
                  <CommandGroup>
                    {finalOptions.map((option) => (
                      <CommandItem
                        key={option.value}
                        value={option.value}
                        keywords={[option.label]}
                        disabled={disabled}
                        onSelect={(currentValue) => {
                          if (disabled) return;

                          const selectedOption = finalOptions.find(
                            (option) => option.value === currentValue,
                          );

                          onChange(
                            currentValue === value ? "" : currentValue,
                            selectedOption,
                          );

                          setOpen(false);
                          setSearch("");
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
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
