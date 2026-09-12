"use client"

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { type Control } from "react-hook-form"
import { type TransactionFormValues } from "@/validation/schemas/add-transaction"
import { TrendingUp, TrendingDown } from "lucide-react"

interface TransactionTypeFieldProps {
  control: Control<TransactionFormValues>
}

export function TransactionTypeField({ control }: TransactionTypeFieldProps) {
  return (
    <FormField
      control={control}
      name="type"
      render={({ field }) => (
        <FormItem className="space-y-2">
          <FormLabel className="text-sm font-semibold">Jenis Transaksi</FormLabel>
          <FormControl>
            <div className="grid grid-cols-2 gap-2 p-1 bg-muted/60 rounded-xl border border-border/60">
              <button
                type="button"
                onClick={() => field.onChange("income")}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                  field.value === "income"
                    ? "bg-background text-emerald-600 dark:text-emerald-400 shadow-sm border border-emerald-500/30"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <TrendingUp className="size-4" />
                Pemasukan
              </button>

              <button
                type="button"
                onClick={() => field.onChange("expense")}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                  field.value === "expense"
                    ? "bg-background text-rose-600 dark:text-rose-400 shadow-sm border border-rose-500/30"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <TrendingDown className="size-4" />
                Pengeluaran
              </button>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}