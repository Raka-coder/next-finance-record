"use client"

import { type Control } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { type TransactionFormValues } from "@/validation/schemas/add-transaction"

interface TransactionCategoryFieldProps {
  control: Control<TransactionFormValues>
  categories: string[]
}

export function TransactionCategoryField({ control, categories }: TransactionCategoryFieldProps) {
  return (
    <FormField
      control={control}
      name="category"
      render={({ field }) => (
        <FormItem className="space-y-2">
          <FormLabel>Kategori</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl className="cursor-pointer">
              <SelectTrigger>
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category} className="max-w-full cursor-pointer">
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage className="-mt-2" />
        </FormItem>
      )}
    />
  )
}