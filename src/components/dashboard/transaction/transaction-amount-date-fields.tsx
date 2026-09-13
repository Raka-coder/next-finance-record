import { format, parse, isValid } from "date-fns"
import { type Control, useFormContext } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { type TransactionFormValues } from "@/validation/schemas/add-transaction"
import { id } from "date-fns/locale"

interface TransactionAmountDateFieldsProps {
  control: Control<TransactionFormValues>
}

const QUICK_AMOUNTS = [
  { label: "+50rb", value: 50000 },
  { label: "+100rb", value: 100000 },
  { label: "+250rb", value: 250000 },
  { label: "+500rb", value: 500000 },
  { label: "+1jt", value: 1000000 },
]

export function TransactionAmountDateFields({ control }: TransactionAmountDateFieldsProps) {
  const form = useFormContext<TransactionFormValues>()

  const safeParseDate = (dateString: string) => {
    try {
      const parsed = parse(dateString, "yyyy-MM-dd", new Date())
      return isValid(parsed) ? parsed : undefined
    } catch {
      return undefined
    }
  }

  const safeFormatDate = (date: Date | undefined, formatString: string) => {
    if (!date || !isValid(date)) return ""
    try {
      return format(date, formatString, { locale: id })
    } catch {
      return ""
    }
  }

  const handleAddQuickAmount = (val: number) => {
    const currentStr = form.getValues("amount") || "0"
    const currentNum = Number(currentStr) || 0
    form.setValue("amount", String(currentNum + val), { shouldValidate: true })
  }

  return (
    <div className="space-y-3">
      {/* Field Nominal */}
      <FormField
        control={control}
        name="amount"
        render={({ field }) => (
          <FormItem className="space-y-1">
            <FormLabel className="text-[11px] font-mono uppercase tracking-[0.06em] text-muted-foreground">
              Nominal (Rp)
            </FormLabel>
            <FormControl>
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 font-mono text-xs text-muted-foreground select-none">
                  Rp
                </span>
                <Input
                  type="number"
                  placeholder="0"
                  className="pl-8 font-mono text-sm font-medium tabular-nums h-8"
                  {...field}
                />
              </div>
            </FormControl>

            {/* Quick Chips diselaraskan di bawah input */}
            <div className="flex items-center gap-1 pt-1 overflow-x-auto">
              <span className="text-[10px] font-mono text-muted-foreground shrink-0 mr-1">Cepat:</span>
              {QUICK_AMOUNTS.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => handleAddQuickAmount(item.value)}
                  className="px-1.5 py-0.5 text-[10px] font-mono rounded-[3px] bg-secondary hover:bg-muted text-foreground border border-border transition-colors cursor-pointer active:scale-95 shrink-0"
                >
                  {item.label}
                </button>
              ))}
            </div>
            <FormMessage className="text-[11px]" />
          </FormItem>
        )}
      />

      {/* Field Tanggal */}
      <FormField
        control={control}
        name="date"
        render={({ field }) => (
          <FormItem className="space-y-1">
            <FormLabel className="text-[11px] font-mono uppercase tracking-[0.06em] text-muted-foreground">
              Tanggal Transaksi
            </FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl className="cursor-pointer">
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "w-full justify-start text-left font-mono text-xs h-8 rounded-[4px]",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value
                      ? safeFormatDate(safeParseDate(field.value), "dd MMMM yyyy")
                      : "Pilih tanggal"}
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 border border-border" align="start">
                <Calendar
                  mode="single"
                  selected={field.value ? safeParseDate(field.value) : undefined}
                  onSelect={(date) =>
                    field.onChange(date ? safeFormatDate(date, "yyyy-MM-dd") : "")
                  }
                  disabled={(date) => date > new Date()}
                  initialFocus
                  locale={id}
                />
              </PopoverContent>
            </Popover>
            <FormMessage className="text-[11px]" />
          </FormItem>
        )}
      />
    </div>
  )
}