"use client"

import { useState, useEffect, useCallback } from "react"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BellRing, Check, Clock, Sparkles } from "lucide-react"
import { RecurringService } from "@/services/recurring.service"
import { toast } from "sonner"
import type { RecurringSchedule } from "@/interfaces/recurring-interface"

interface RecurringDueBannerProps {
  onTransactionExecuted?: () => void
}

export function RecurringDueBanner({ onTransactionExecuted }: RecurringDueBannerProps) {
  const [dueSchedules, setDueSchedules] = useState<RecurringSchedule[]>([])
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [isDismissed, setIsDismissed] = useState(false)

  const loadDue = useCallback(async () => {
    try {
      const data = await RecurringService.getDueSchedules()
      setDueSchedules(data)
    } catch (err) {
      console.error("Error loading due schedules:", err)
    }
  }, [])

  useEffect(() => {
    loadDue()
  }, [loadDue])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const handleExecute = async (schedule: RecurringSchedule) => {
    try {
      setProcessingId(schedule.id)
      await RecurringService.executeSchedule(schedule.id)
      toast.success(`Transaksi "${schedule.description}" berhasil dicatat!`)
      // Refresh local list
      await loadDue()
      if (onTransactionExecuted) {
        onTransactionExecuted()
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal mengeksekusi transaksi"
      toast.error(msg)
    } finally {
      setProcessingId(null)
    }
  }

  if (isDismissed || dueSchedules.length === 0) {
    return null
  }

  return (
    <Alert className="border-amber-500/40 bg-amber-500/10 text-foreground relative overflow-hidden shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="size-9 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
            <BellRing className="size-5 animate-bounce" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <AlertTitle className="text-base font-semibold text-amber-900 dark:text-amber-200">
                Pengingat Tagihan & Transaksi Jatuh Tempo
              </AlertTitle>
              <Badge className="bg-amber-500 text-amber-950 font-bold text-xs py-0">
                {dueSchedules.length} Perlu Dicatat
              </Badge>
            </div>
            <AlertDescription className="text-xs text-amber-800/90 dark:text-amber-300/90">
              Ada jadwal transaksi rutin yang telah memasuki tanggal jatuh tempo. Konfirmasi untuk mencatatnya langsung ke pembukuan.
            </AlertDescription>
          </div>
        </div>

        <button
          onClick={() => setIsDismissed(true)}
          className="text-xs text-muted-foreground hover:text-foreground self-end md:self-center absolute top-2 right-2 md:static"
        >
          Tutup ✕
        </button>
      </div>

      {/* List of due items */}
      <div className="mt-4 pt-3 border-t border-amber-500/20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {dueSchedules.map((schedule) => (
          <div
            key={schedule.id}
            className="flex items-center justify-between gap-2 p-2.5 rounded-md bg-background/80 border border-amber-500/30 shadow-xs"
          >
            <div className="min-w-0">
              <p className="font-semibold text-xs truncate text-foreground">{schedule.description}</p>
              <p className="text-[11px] font-mono tabular-nums text-muted-foreground">
                {formatCurrency(Number(schedule.amount))} •{" "}
                <span className="capitalize">{schedule.frequency}</span>
              </p>
            </div>

            <Button
              size="sm"
              className="h-7 text-xs gap-1 shrink-0 bg-amber-600 hover:bg-amber-700 text-white"
              disabled={processingId === schedule.id}
              onClick={() => handleExecute(schedule)}
            >
              {processingId === schedule.id ? (
                <Clock className="size-3 animate-spin" />
              ) : (
                <Check className="size-3" />
              )}
              Catat
            </Button>
          </div>
        ))}
      </div>
    </Alert>
  )
}
