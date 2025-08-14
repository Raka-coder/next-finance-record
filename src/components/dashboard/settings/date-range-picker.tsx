"use client"

import { format } from "date-fns"
import { id } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"

interface DateRange {
  startDate: Date | undefined
  endDate: Date | undefined
}

interface DateRangePickerProps {
  dateRange: DateRange
  setDateRange: (dateRange: DateRange) => void
}

export function DateRangePicker({ dateRange, setDateRange }: DateRangePickerProps) {
  const clearDateRange = () => {
    setDateRange({ startDate: undefined, endDate: undefined })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <CalendarIcon className="size-4" />
        <Label className="text-sm font-medium">
          Filter Periode (Opsional)
        </Label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Start Date */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">
            Tanggal Mulai
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !dateRange.startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.startDate
                  ? format(dateRange.startDate, "dd MMMM yyyy", {
                    locale: id,
                  })
                  : "Pilih tanggal mulai"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateRange.startDate}
                onSelect={(date) =>
                  setDateRange({ ...dateRange, startDate: date })
                }
                disabled={(date) =>
                  date > new Date() ||
                  (dateRange.endDate ? date > dateRange.endDate : false)
                }
                initialFocus
                locale={id}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* End Date */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">
            Tanggal Akhir
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !dateRange.endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.endDate
                  ? format(dateRange.endDate, "dd MMMM yyyy", {
                    locale: id,
                  })
                  : "Pilih tanggal akhir"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateRange.endDate}
                onSelect={(date) =>
                  setDateRange({ ...dateRange, endDate: date })
                }
                disabled={(date) =>
                  date > new Date() ||
                  (dateRange.endDate ? date > dateRange.endDate : false)
                }
                initialFocus
                locale={id}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Clear Filter Button */}
      {(dateRange.startDate || dateRange.endDate) && (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={clearDateRange}
            className="text-muted-foreground"
          >
            Hapus Filter
          </Button>
          <Label className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-md">
            Filter aktif:{" "}
            {dateRange.startDate &&
              format(dateRange.startDate, "dd MMM yyyy", { locale: id })}
            {dateRange.startDate && dateRange.endDate && " - "}
            {dateRange.endDate &&
              format(dateRange.endDate, "dd MMM yyyy", { locale: id })}
          </Label>
        </div>
      )}
    </div>
  )
}