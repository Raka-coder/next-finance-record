"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Repeat, ArrowUpRight, Check, Clock, Calendar } from "lucide-react"
import { RecurringService } from "@/services/recurring.service"
import { toast } from "sonner"
import Link from "next/link"
import type { RecurringSchedule } from "@/interfaces/recurring-interface"

interface RecurringSummaryCardProps {
  onTransactionExecuted?: () => void
}

export function RecurringSummaryCard({ onTransactionExecuted }: RecurringSummaryCardProps) {
  const [schedules, setSchedules] = useState<RecurringSchedule[]>([])
  const [loading, setLoading] = useState(true)
  const [executingId, setExecutingId] = useState<string | null>(null)

  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      const data = await RecurringService.getRecurringSchedules()
      setSchedules(data)
    } catch (err) {
      console.error("Error loading recurring schedules in widget:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const today = new Date().toISOString().split("T")[0]
  const activeSchedules = schedules.filter((s) => s.is_active)
  const dueSchedules = schedules.filter((s) => s.is_active && s.next_due_date <= today)

  const handleExecute = async (schedule: RecurringSchedule) => {
    try {
      setExecutingId(schedule.id)
      await RecurringService.executeSchedule(schedule.id)
      toast.success(`Transaksi "${schedule.description}" berhasil dicatat!`)
      await loadData()
      if (onTransactionExecuted) {
        onTransactionExecuted()
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal mengeksekusi transaksi"
      toast.error(msg)
    } finally {
      setExecutingId(null)
    }
  }

  // Preview the first 3 upcoming or due schedules
  const previewSchedules = schedules.slice(0, 3)

  return (
    <Card className="border border-border bg-card p-5 gap-0 shadow-none rounded-md">
      <CardHeader className="p-0 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Repeat className="size-4 text-muted-foreground" />
            <CardTitle className="text-sm font-semibold tracking-tight text-foreground">
              Catat Otomatis & Tagihan Rutin
            </CardTitle>
          </div>
          <Button variant="ghost" size="sm" asChild className="h-7 px-2 font-mono text-xs text-muted-foreground hover:text-foreground">
            <Link href="/dashboard/recurring" className="flex items-center gap-1">
              Kelola Semua
              <ArrowUpRight className="size-3.5" />
            </Link>
          </Button>
        </div>
        <CardDescription className="text-xs text-muted-foreground">
          {activeSchedules.length} jadwal aktif &middot; {dueSchedules.length} jadwal siap dieksekusi hari ini
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0 pt-2">
        {loading ? (
          <div className="py-6 text-center text-xs font-mono text-muted-foreground">
            Memuat jadwal berulang...
          </div>
        ) : schedules.length === 0 ? (
          <div className="py-6 text-center border border-dashed border-border rounded-[4px] px-4">
            <p className="text-xs text-muted-foreground mb-3">
              Belum ada jadwal transaksi rutin atau langganan otomatis yang dikonfigurasi.
            </p>
            <Button size="sm" variant="outline" asChild className="font-mono text-xs">
              <Link href="/dashboard/recurring">
                + Tambah Jadwal Berulang
              </Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {previewSchedules.map((schedule) => {
              const isDue = schedule.is_active && schedule.next_due_date <= today
              const isIncome = schedule.type === "income"

              return (
                <div
                  key={schedule.id}
                  className={`flex items-center justify-between p-2.5 rounded-[4px] border transition-colors ${
                    isDue
                      ? "border-amber-500/40 bg-amber-500/5 dark:bg-amber-500/10"
                      : "border-border bg-secondary/30"
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-foreground truncate">
                        {schedule.description}
                      </span>
                      {isDue && (
                        <Badge variant="outline" className="bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30 text-[9px] px-1.5 py-0 h-4">
                          Jatuh Tempo
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 text-[11px] font-mono text-muted-foreground">
                      <span className="capitalize">{schedule.frequency}</span>
                      <span>&middot;</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="size-3" />
                        {schedule.next_due_date}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className={`text-xs font-mono font-medium tabular-nums ${
                        isIncome ? "text-[#346538] dark:text-[#81C784]" : "text-[#9F2F2D] dark:text-[#F87171]"
                      }`}
                    >
                      {isIncome ? "+" : "-"}
                      {formatCurrency(Number(schedule.amount))}
                    </span>

                    {isDue && (
                      <Button
                        size="sm"
                        className="h-7 px-2.5 text-xs gap-1 bg-amber-600 hover:bg-amber-700 text-white cursor-pointer"
                        disabled={executingId === schedule.id}
                        onClick={() => handleExecute(schedule)}
                      >
                        {executingId === schedule.id ? (
                          <Clock className="size-3 animate-spin" />
                        ) : (
                          <Check className="size-3" />
                        )}
                        Catat
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
