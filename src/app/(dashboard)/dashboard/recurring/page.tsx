"use client"

import { useState, useEffect, useCallback } from "react"
import { RecurringList } from "@/components/dashboard/recurring/recurring-list"
import { RecurringService } from "@/services/recurring.service"
import type { RecurringSchedule } from "@/interfaces/recurring-interface"

export default function RecurringPage() {
  const [schedules, setSchedules] = useState<RecurringSchedule[]>([])
  const [loading, setLoading] = useState(true)

  const loadSchedules = useCallback(async () => {
    try {
      setLoading(true)
      const data = await RecurringService.getRecurringSchedules()
      setSchedules(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadSchedules()
  }, [loadSchedules])

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold tracking-tight">Tagihan & Transaksi Berulang</h1>
        <p className="text-sm text-muted-foreground">
          Kelola pembayaran rutin, jadwal langganan, dan setujui pencatatan transaksi tepat waktu.
        </p>
      </div>

      <RecurringList
        schedules={schedules}
        isLoading={loading}
        onRefresh={loadSchedules}
      />
    </div>
  )
}
