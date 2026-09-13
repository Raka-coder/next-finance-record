"use client"

import { type Control } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { type TransactionFormValues } from "@/validation/schemas/add-transaction"

interface TransactionDescriptionFieldProps {
  control: Control<TransactionFormValues>
}

export function TransactionDescriptionField({ control }: TransactionDescriptionFieldProps) {
  return (
    <FormField
      control={control}
      name="description"
      render={({ field }) => (
        <FormItem className="space-y-1">
          <FormLabel className="text-[11px] font-mono uppercase tracking-[0.06em] text-muted-foreground">
            Deskripsi / Catatan
          </FormLabel>
          <FormControl>
            <Textarea
              placeholder="Contoh: Belanja bahan bulanan, Gaji pokok, dll."
              rows={2}
              className="resize-none"
              {...field}
            />
          </FormControl>
          <FormMessage className="text-[11px]" />
        </FormItem>
      )}
    />
  )
}