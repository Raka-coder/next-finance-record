"use client"

import { type Control } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { type TransactionFormValues } from "@/validation/schemas/add-transaction"
import { Tag } from "lucide-react"

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
        <FormItem className="space-y-1.5">
          <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Kategori
          </FormLabel>
          <Select onValueChange={field.onChange} value={field.value || ""}>
            <FormControl className="cursor-pointer">
              <SelectTrigger className="h-10 rounded-xl border-border/70">
                <div className="flex items-center gap-2">
                  <Tag className="size-4 text-muted-foreground shrink-0" />
                  <SelectValue placeholder="Pilih kategori transaksi" />
                </div>
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category} className="cursor-pointer">
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  )
}