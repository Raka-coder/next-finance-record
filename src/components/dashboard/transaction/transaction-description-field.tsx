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
        <FormItem className="space-y-2">
          <FormLabel>Deskripsi</FormLabel>
          <FormControl>
            <Textarea
              placeholder="Masukkan deskripsi transaksi..."
              {...field}
            />
          </FormControl>
          <FormMessage className="-mt-2" />
        </FormItem>
      )}
    />
  )
}