import type { AnyFieldApi } from "@tanstack/react-form"
import { useState } from "react"
import { Label } from "../ui/label"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Button } from "../ui/button"
import { bagianOptions } from "@/lib/options"
import { Check, ChevronsUpDown } from "lucide-react"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../ui/command"
import { cn } from "@/lib/utils"
import { Input } from "../ui/input"

type MengetahuiValue = {
  mengetahui: "ada" | "tidak"
  bagian: string
  jabatan: string
}

type Props = {
  field: AnyFieldApi
}

export function MengetahuiSection({ field }: Props) {
  const [open, setOpen] = useState(false)

  const value = field.state.value as MengetahuiValue
  const isDisabled = value.mengetahui === "tidak"

  return (
    <>
      <div className="flex items-center gap-2">
        <Label className="whitespace-nowrap">Mengetahui</Label>

        <RadioGroup
          value={value.mengetahui}
          onValueChange={(v) =>
            field.handleChange({
              ...value,
              mengetahui: v as "ada" | "tidak",
            })
          }
          className="flex flex-row items-center gap-4"
        >
          <div className="flex items-center gap-1">
            <RadioGroupItem value="ada" id="ada" />
            <Label htmlFor="ada">Ada</Label>
          </div>

          <div className="flex items-center gap-1">
            <RadioGroupItem value="tidak" id="tidak" />
            <Label htmlFor="tidak">Tidak</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="flex gap-5">
        {isDisabled ? (
          <Button variant="outline" className="h-8 justify-between" disabled>
            Pilih Bagian
            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        ) : (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className="h-8 justify-between"
              >
                {value.bagian
                  ? bagianOptions.find((item) => item.value === value.bagian)
                      ?.label
                  : "Pilih Bagian"}

                <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>

            <PopoverContent className="p-0">
              <Command>
                <CommandInput placeholder="Cari bagian..." />
                <CommandEmpty>Tidak ditemukan.</CommandEmpty>

                <CommandGroup>
                  {bagianOptions.map((item) => (
                    <CommandItem
                      key={item.value}
                      value={item.label}
                      onSelect={() => {
                        field.handleChange({
                          ...value,
                          bagian: item.value,
                        })
                        setOpen(false)
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value.bagian === item.value
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {item.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        )}

        <Input
          className="h-8 w-[260px]"
          placeholder="Input Nama Jabatan"
          disabled={isDisabled}
          value={value.jabatan}
          onChange={(e) =>
            field.handleChange({
              ...value,
              jabatan: e.target.value,
            })
          }
        />
      </div>
    </>
  )
}
