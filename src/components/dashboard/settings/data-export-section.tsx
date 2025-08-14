"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { CalendarIcon, Download, CheckCircle, AlertCircle, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { ExportService } from "@/services/export/export-csv-service"
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

  // Load export summary on component mount
  useEffect(() => {
    if (user.email) {
      loadExportSummary()
    }
  }, [user.email])

  const loadExportSummary = async () => {
    if (!user.email) {
      console.log("No user email available")
      return
    }

    try {
      setSummaryLoading(true)
      setSummaryError("")
      console.log("Loading export summary for:", user.email)

      const summary = await ExportService.getExportSummary(user.email)
      console.log("Export summary loaded:", summary)
      setExportSummary(summary)
    } catch (error) {
      console.error("Failed to load export summary:", error)
      setSummaryError(error instanceof Error ? error.message : "Failed to load summary")

      // Set fallback summary
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
  }

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

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setExportProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 15
        })
      }, 200)

      // Call export service
      await ExportService.exportTransactionsCSV({
        email: user.email,
        startDate: dateRange.startDate ? format(dateRange.startDate, "yyyy-MM-dd") : undefined,
        endDate: dateRange.endDate ? format(dateRange.endDate, "yyyy-MM-dd") : undefined,
      })

      // Complete progress
      setExportProgress(100)
      clearInterval(progressInterval)
      setExportSuccess(true)

      // Reset success message after 3 seconds
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
    <div className="space-y-6">
      {/* Export Information */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Ekspor Data:</strong> Unduh semua transaksi Anda dalam
          format CSV yang dapat dibuka dengan Excel atau Google Sheets.
          Gunakan filter tanggal untuk membatasi periode data yang akan
          diekspor.
        </AlertDescription>
      </Alert>

      {/* Date Range Filter */}
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
                    setDateRange((prev) => ({ ...prev, endDate: date }))
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

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={handleExportData}
            disabled={exportLoading}
            className="flex items-center gap-2"
          >
            {exportLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Mengekspor...
              </>
            ) : exportSuccess ? (
              <>
                <CheckCircle className="size-4" />
                Berhasil Diekspor
              </>
            ) : (
              <>
                <Download className="size-4" />
                Ekspor Data CSV
              </>
            )}
          </Button>
        </div>

        {/* Progress Bar */}
        {exportLoading && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Memproses data transaksi...</span>
              <span>{exportProgress}%</span>
            </div>
            <Progress value={exportProgress} className="h-2" />
          </div>
        )}

        {/* Export Success Message */}
        {exportSuccess && (
          <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-md">
            <CheckCircle className="size-4 text-green-600" />
            <span className="text-sm text-green-700">
              Data berhasil diekspor! File CSV telah diunduh.
            </span>
          </div>
        )}

        {/* Export Error Message */}
        {exportError && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
            <AlertCircle className="size-4 text-red-600" />
            <span className="text-sm text-red-700">{exportError}</span>
          </div>
        )}

        {/* Data Summary */}
        {summaryLoading ? (
          <div className="flex items-center justify-center p-4 bg-muted/50 rounded-lg">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span className="ml-2 text-sm">Memuat ringkasan data...</span>
          </div>
        ) : summaryError ? (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="size-4 text-red-600" />
              <p className="text-sm text-red-600">Error: {summaryError}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={loadExportSummary}
              className="bg-transparent"
            >
              Coba Lagi
            </Button>
          </div>
        ) : exportSummary ? (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">
              Ringkasan Data Anda
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {exportSummary.totalTransactions}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total Transaksi
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {exportSummary.incomeCount}
                </div>
                <div className="text-sm text-muted-foreground">
                  Pemasukan
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {exportSummary.expenseCount}
                </div>
                <div className="text-sm text-muted-foreground">
                  Pengeluaran
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Format Information */}
      <div className="space-y-3">
        <h4 className="font-medium flex items-center gap-2">
          <Info className="size-4" />
          Informasi Format Ekspor
        </h4>
        <AlertDescription className="border rounded-lg p-4 space-y-2">
          <p className="text-sm text-muted-foreground">
            <strong>Format CSV:</strong> Tanggal, Deskripsi, Kategori,
            Jenis, Jumlah
          </p>
          <li className="text-sm text-muted-foreground">
            File dapat dibuka dengan Microsoft Excel, Google Sheets, atau
            aplikasi spreadsheet lainnya
          </li>
          <li className="text-sm text-muted-foreground">
            Format mata uang dalam Rupiah (IDR)
          </li>
        </AlertDescription>
      </div>
    </div>
  )
}