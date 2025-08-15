"use client"

import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { type Control } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { type TransactionFormValues } from "@/validation/schemas/transaction"
import { id } from "date-fns/locale"

interface TransactionAmountDateFieldsProps {
  control: Control<TransactionFormValues>
}

export function TransactionAmountDateFields({ control }: TransactionAmountDateFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={control}
        name="amount"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <FormLabel>Jumlah (Rp)</FormLabel>
            <FormControl>
              <Input type="number" placeholder="0" {...field} />
            </FormControl>
            <FormMessage className="-mt-2" />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="date"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <FormLabel>Tanggal</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl className="cursor-pointer">
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {field.value
                      ? format(new Date(field.value), "dd MMMM yyyy", {locale: id})
                      : "Pilih tanggal"}
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  className="cursor-pointer"
                  mode="single"
                  selected={field.value ? new Date(field.value) : undefined}
                  onSelect={(date) =>
                    field.onChange(date ? format(date, "dd-MM-yyyy", {locale: id}) : "")
                  }
                  disabled={(date) => date > new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <FormMessage className="-mt-2" />
          </FormItem>
        )}
      />
    </div>
  )
}