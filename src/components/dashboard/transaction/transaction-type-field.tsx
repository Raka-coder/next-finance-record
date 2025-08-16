"use client"

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { type Control } from "react-hook-form"
import { type TransactionFormValues } from "@/validation/schemas/add-transaction"

interface TransactionTypeFieldProps {
  control: Control<TransactionFormValues>
}

export function TransactionTypeField({ control }: TransactionTypeFieldProps) {
  return (
    <FormField
      control={control}
      name="type"
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel>Jenis Transaksi</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="income" id="income" />
                <Label htmlFor="income" className="text-green-600 font-medium">
                  Pemasukan
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="expense" id="expense" />
                <Label htmlFor="expense" className="text-red-600 font-medium">
                  Pengeluaran
                </Label>
              </div>
            </RadioGroup>
          </FormControl>
          <FormMessage className="-mt-2" />
        </FormItem>
      )}
    />
  )
}