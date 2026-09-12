"use client"

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { type Control, useFormContext } from "react-hook-form"
import { type TransactionFormValues } from "@/validation/schemas/add-transaction"
import { TrendingUp, TrendingDown } from "lucide-react"

interface TransactionTypeFieldProps {
  control: Control<TransactionFormValues>
}

export function TransactionTypeField({ control }: TransactionTypeFieldProps) {
  const form = useFormContext<TransactionFormValues>()

  const handleSelectType = (val: "income" | "expense", onChange: (v: "income" | "expense") => void) => {
    onChange(val)
    // Otomatis reset kategori jika berganti tipe transaksi agar tidak mismatch
    form.setValue("category", "")
  }

  return (
    <FormField
      control={control}
      name="type"
      render={({ field }) => (
        <FormItem className="space-y-1.5">
          <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Jenis Transaksi
          </FormLabel>
          <FormControl>
            <div className="grid grid-cols-2 gap-2 p-1 bg-muted/50 rounded-xl border border-border/60">
              <button
                type="button"
                onClick={() => handleSelectType("income", field.onChange)}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                  field.value === "income"
                    ? "bg-background text-emerald-600 dark:text-emerald-400 shadow-xs border border-emerald-500/30"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <TrendingUp className="size-4" />
                <span>Pemasukan</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectType("expense", field.onChange)}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                  field.value === "expense"
                    ? "bg-background text-rose-600 dark:text-rose-400 shadow-xs border border-rose-500/30"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <TrendingDown className="size-4" />
                <span>Pengeluaran</span>
              </button>
            </div>
          </FormControl>
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  )
}