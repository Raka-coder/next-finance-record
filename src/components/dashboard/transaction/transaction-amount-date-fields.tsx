import { format, parse, isValid } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { type Control } from "react-hook-form"
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

export function TransactionAmountDateFields({ control }: TransactionAmountDateFieldsProps) {
  // Fungsi untuk memparse tanggal dengan penanganan error
  const safeParseDate = (dateString: string) => {
    try {
      const parsed = parse(dateString, "yyyy-MM-dd", new Date())
      return isValid(parsed) ? parsed : undefined
    } catch {
      return undefined
    }
  }

  // Fungsi untuk memformat tanggal dengan penanganan error
  const safeFormatDate = (date: Date | undefined, formatString: string) => {
    if (!date || !isValid(date)) return ""
    try {
      return format(date, formatString, { locale: id })
    } catch {
      return ""
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={control}
        name="amount"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <FormLabel>Jumlah (Rp)</FormLabel>
            <FormControl>
              <Input type="number" placeholder="0" {...field} />
            </FormControl>
            <FormMessage className="-mt-2" />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="date"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <FormLabel>Tanggal</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl className="cursor-pointer">
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
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
            <FormMessage className="-mt-2" />
          </FormItem>
        )}
      />
    </div>
  )
}