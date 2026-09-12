import { format, parse, isValid } from "date-fns"
import { CalendarIcon } from "lucide-react"
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={control}
        name="amount"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <FormLabel className="text-sm font-semibold">Nominal Transaksi (Rp)</FormLabel>
            <FormControl>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-sm font-semibold text-muted-foreground">
                  Rp
                </span>
                <Input
                  type="number"
                  placeholder="0"
                  className="pl-10 font-mono text-base font-semibold"
                  {...field}
                />
              </div>
            </FormControl>
            {/* Quick Amount Chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {QUICK_AMOUNTS.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => handleAddQuickAmount(item.value)}
                  className="px-2 py-0.5 text-[11px] font-mono font-medium rounded-md bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground border border-border/60 transition-colors cursor-pointer active:scale-95"
                >
                  {item.label}
                </button>
              ))}
            </div>
            <FormMessage className="-mt-1" />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="date"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <FormLabel className="text-sm font-semibold">Tanggal Transaksi</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl className="cursor-pointer">
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal h-10",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {field.value
                      ? safeFormatDate(safeParseDate(field.value), "dd MMMM yyyy")
                      : "Pilih tanggal"}
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  className="cursor-pointer"
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
            <FormMessage className="-mt-1" />
          </FormItem>
        )}
      />
    </div>
  )
}