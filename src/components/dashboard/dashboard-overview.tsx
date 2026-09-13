"use client"

import { useState, useEffect, useCallback } from "react"
import { FinancialSummary } from "@/components/dashboard/financial-summary"
import { RecurringDueBanner } from "@/components/dashboard/recurring/recurring-due-banner"
import { RecurringSummaryCard } from "@/components/dashboard/recurring/recurring-summary-card"
import Loading from "@/components/loading/loading-component"
import { useTransactions } from "@/hooks/use-transaction"
import { AnalyticsService } from "@/services/analytics.service"
import type { MonthOverMonthData, MonthlyTrendPoint } from "@/services/analytics.service"

export function DashboardOverview() {
  const { transactions, loading, error, addTransaction, refetch } = useTransactions()
  const [momData, setMomData] = useState<MonthOverMonthData | null>(null)
  const [sixMonthTrend, setSixMonthTrend] = useState<MonthlyTrendPoint[]>([])

  const fetchAnalytics = useCallback(async () => {
    try {
      const [mom, trend] = await Promise.all([
        AnalyticsService.getMonthOverMonthComparison(),
        AnalyticsService.getSixMonthTrend(),
      ])
      setMomData(mom)
      setSixMonthTrend(trend)
    } catch (err) {
      console.error("Gagal memuat data analitik:", err)
    }
  }, [])

  useEffect(() => {
    fetchAnalytics()
  }, [fetchAnalytics, transactions])

  const handleTransactionExecuted = () => {
    refetch()
    fetchAnalytics()
  }

  if (loading) {
    return <Loading />
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error: {error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <RecurringDueBanner onTransactionExecuted={handleTransactionExecuted} />
      <FinancialSummary
        transactions={transactions}
        onAddTransaction={addTransaction}
        momData={momData}
        sixMonthTrend={sixMonthTrend}
      />
      <RecurringSummaryCard onTransactionExecuted={handleTransactionExecuted} />
    </div>
  )
}
