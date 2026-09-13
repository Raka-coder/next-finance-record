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
        <FormItem className="space-y-1">
          <FormLabel className="text-[11px] font-mono uppercase tracking-[0.06em] text-muted-foreground">
            Kategori
          </FormLabel>
          <Select onValueChange={field.onChange} value={field.value || ""}>
            <FormControl className="cursor-pointer">
              <SelectTrigger className="h-8 rounded-[4px]">
                <SelectValue placeholder="Pilih kategori pos" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category} className="cursor-pointer font-mono text-xs">
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage className="text-[11px]" />
        </FormItem>
      )}
    />
  )
}