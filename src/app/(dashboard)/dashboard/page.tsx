"use client"

import { FinancialSummary } from "@/components/dashboard/financial-summary"
import Loading from "@/components/loading/loading-component"
import { useTransactions } from "@/hooks/use-transaction"

export default function DashboardPage() {
  const { transactions, loading, error } = useTransactions()

  if (loading) {
    return (
      <Loading />
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error: {error}</p>
      </div>
    )
  }

  return <FinancialSummary transactions={transactions} />
}
