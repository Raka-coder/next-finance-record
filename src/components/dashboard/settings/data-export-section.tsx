"use client"

import { useEffect, useState, useCallback } from "react"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { CalendarIcon, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { ExportService } from "@/services/export/export-csv.service"
import type { User } from "@supabase/supabase-js"

interface ExportSummary {
  totalTransactions: number
  totalIncome: number
  totalExpense: number
  balance: number
  incomeCount: number
  expenseCount: number
}

interface DateRange {
  startDate: Date | undefined
  endDate: Date | undefined
}

interface DataExportSectionProps {
  user: User
}

export function DataExportSection({ user }: DataExportSectionProps) {
  const [exportLoading, setExportLoading] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)
  const [exportSuccess, setExportSuccess] = useState(false)
  const [exportError, setExportError] = useState("")
  const [exportSummary, setExportSummary] = useState<ExportSummary | null>(null)
  const [summaryLoading, setSummaryLoading] = useState(false)
  const [summaryError, setSummaryError] = useState("")
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: undefined,
    endDate: undefined,
  })

  const loadExportSummary = useCallback(async () => {
    if (!user.email) {
      return
    }

    try {
      setSummaryLoading(true)
      setSummaryError("")
      const summary = await ExportService.getExportSummary(user.email)
      setExportSummary(summary)
    } catch (error) {
      console.error("Failed to load export summary:", error)
      setSummaryError(error instanceof Error ? error.message : "Gagal memuat ringkasan")

      setExportSummary({
        totalTransactions: 0,
        totalIncome: 0,
        totalExpense: 0,
        balance: 0,
        incomeCount: 0,
        expenseCount: 0,
      })
    } finally {
      setSummaryLoading(false)
    }
  }, [user.email])

  useEffect(() => {
    if (user.email) {
      loadExportSummary()
    }
  }, [user.email, loadExportSummary])

  const handleExportData = async () => {
    if (!user.email) {
      setExportError("Email pengguna tidak ditemukan")
      return
    }

    try {
      setExportLoading(true)
      setExportProgress(0)
      setExportSuccess(false)
      setExportError("")

      const progressInterval = setInterval(() => {
        setExportProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 15
        })
      }, 200)

      await ExportService.exportTransactionsCSV({
        email: user.email,
        startDate: dateRange.startDate ? format(dateRange.startDate, "yyyy-MM-dd") : undefined,
        endDate: dateRange.endDate ? format(dateRange.endDate, "yyyy-MM-dd") : undefined,
      })

      setExportProgress(100)
      clearInterval(progressInterval)
      setExportSuccess(true)

      setTimeout(() => setExportSuccess(false), 3000)
    } catch (error) {
      console.error("Export error:", error)
      setExportError(error instanceof Error ? error.message : "Gagal mengekspor data")
    } finally {
      setExportLoading(false)
      setTimeout(() => {
        setExportProgress(0)
        setExportError("")
      }, 2000)
    }
  }

  const clearDateRange = () => {
    setDateRange({ startDate: undefined, endDate: undefined })
  }

  return (
    <div className="space-y-4">
      {/* Date Range Filter */}
      <div className="space-y-2">
        <Label className="text-[11px] font-mono uppercase tracking-[0.06em] text-muted-foreground">
          Rentang Tanggal (Opsional)
        </Label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {/* Start Date */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "w-full justify-start text-left font-mono text-xs h-8 rounded-[4px]",
                  !dateRange.startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                {dateRange.startDate
                  ? format(dateRange.startDate, "dd MMM yyyy", { locale: id })
                  : "Mulai tanggal..."}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 border border-border" align="start">
              <Calendar
                mode="single"
                selected={dateRange.startDate}
                onSelect={(date) =>
                  setDateRange((prev) => ({ ...prev, startDate: date }))
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

          {/* End Date */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "w-full justify-start text-left font-mono text-xs h-8 rounded-[4px]",
                  !dateRange.endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                {dateRange.endDate
                  ? format(dateRange.endDate, "dd MMM yyyy", { locale: id })
                  : "Hingga tanggal..."}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 border border-border" align="start">
              <Calendar
                mode="single"
                selected={dateRange.endDate}
                onSelect={(date) =>
                  setDateRange((prev) => ({ ...prev, endDate: date }))
                }
                disabled={(date) =>
                  date > new Date() ||
                  (dateRange.startDate ? date < dateRange.startDate : false)
                }
                initialFocus
                locale={id}
              />
            </PopoverContent>
          </Popover>
        </div>

        {(dateRange.startDate || dateRange.endDate) && (
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={clearDateRange}
              className="text-[11px] font-mono text-muted-foreground hover:text-foreground underline cursor-pointer"
            >
              Reset filter
            </button>
          </div>
        )}
      </div>

      {/* Action button */}
      <div className="pt-2">
        <Button
          onClick={handleExportData}
          disabled={exportLoading}
          size="sm"
          className="font-mono text-xs cursor-pointer"
        >
          {exportLoading ? (
            <>
              <Loader2 className="size-3.5 animate-spin mr-1.5" />
              Mengekspor berkas...
            </>
          ) : exportSuccess ? (
            "Berhasil Diunduh"
          ) : (
            "Unduh Berkas .CSV"
          )}
        </Button>
      </div>

      {exportLoading && (
        <div className="space-y-1 pt-1 max-w-xs">
          <div className="flex justify-between text-[11px] font-mono text-muted-foreground">
            <span>Menyiapkan baris CSV</span>
            <span>{exportProgress}%</span>
          </div>
          <Progress value={exportProgress} className="h-1 bg-muted" />
        </div>
      )}

      {exportError && (
        <div className="p-2.5 rounded-[4px] border border-[#F5C2C7] bg-[#FDEBEC] text-[#9F2F2D] text-xs font-mono">
          {exportError}
        </div>
      )}

      {/* Summary Matrix */}
      {summaryLoading ? (
        <div className="py-4 text-xs font-mono text-muted-foreground">
          Memuat ringkasan pembukuan...
        </div>
      ) : summaryError ? (
        <div className="py-2 text-xs font-mono text-[#9F2F2D]">
          {summaryError}
        </div>
      ) : exportSummary ? (
        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border">
          <div className="p-2.5 bg-secondary/50 rounded-[4px] border border-border">
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block">
              Total Entri
            </span>
            <span className="text-base font-mono font-medium text-foreground tabular-nums">
              {exportSummary.totalTransactions}
            </span>
          </div>
          <div className="p-2.5 bg-secondary/50 rounded-[4px] border border-border">
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block">
              Kas Masuk
            </span>
            <span className="text-base font-mono font-medium text-[#346538] dark:text-[#81C784] tabular-nums">
              {exportSummary.incomeCount}
            </span>
          </div>
          <div className="p-2.5 bg-secondary/50 rounded-[4px] border border-border">
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block">
              Kas Keluar
            </span>
            <span className="text-base font-mono font-medium text-[#9F2F2D] dark:text-[#F87171] tabular-nums">
              {exportSummary.expenseCount}
            </span>
          </div>
        </div>
      ) : null}
    </div>
  )
}