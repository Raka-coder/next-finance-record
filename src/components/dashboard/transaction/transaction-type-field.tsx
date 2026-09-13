"use client"

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { type Control, useFormContext } from "react-hook-form"
import { type TransactionFormValues } from "@/validation/schemas/add-transaction"

interface TransactionTypeFieldProps {
  control: Control<TransactionFormValues>
}

export function TransactionTypeField({ control }: TransactionTypeFieldProps) {
  const form = useFormContext<TransactionFormValues>()

  const handleSelectType = (val: "income" | "expense", onChange: (v: "income" | "expense") => void) => {
    onChange(val)
    form.setValue("category", "")
  }

  return (
    <FormField
      control={control}
      name="type"
      render={({ field }) => (
        <FormItem className="space-y-1">
          <FormLabel className="text-[11px] font-mono uppercase tracking-[0.06em] text-muted-foreground">
            Jenis Pos
          </FormLabel>
          <FormControl>
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-secondary border border-border rounded-[4px]">
              <button
                type="button"
                onClick={() => handleSelectType("income", field.onChange)}
                className={`py-1.5 px-3 rounded-[3px] text-xs font-mono font-medium transition-colors cursor-pointer ${
                  field.value === "income"
                    ? "bg-card text-[#346538] dark:text-[#81C784] border border-border"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                + Pemasukan
              </button>

              <button
                type="button"
                onClick={() => handleSelectType("expense", field.onChange)}
                className={`py-1.5 px-3 rounded-[3px] text-xs font-mono font-medium transition-colors cursor-pointer ${
                  field.value === "expense"
                    ? "bg-card text-[#9F2F2D] dark:text-[#F87171] border border-border"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                - Pengeluaran
              </button>
            </div>
          </FormControl>
          <FormMessage className="text-[11px]" />
        </FormItem>
      )}
    />
  )
}