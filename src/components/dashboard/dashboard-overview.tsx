"use client"

import { FinancialSummary } from "@/components/dashboard/financial-summary"
import { RecurringDueBanner } from "@/components/dashboard/recurring/recurring-due-banner"
import Loading from "@/components/loading/loading-component"
import { useTransactions } from "@/hooks/use-transaction"

export function DashboardOverview() {
  const { transactions, loading, error, addTransaction, refetch } = useTransactions()

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
      <RecurringDueBanner onTransactionExecuted={refetch} />
      <FinancialSummary
        transactions={transactions}
        onAddTransaction={addTransaction}
      />
    </div>
  )
}
