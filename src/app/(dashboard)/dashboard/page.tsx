"use client"

import { FinancialSummary } from "@/components/dashboard/financial-summary"
import { useTransactions } from "@/hooks/use-transaction"

export default function DashboardPage() {
  const { transactions, loading, error } = useTransactions()

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
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
