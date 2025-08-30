"use client"

import { FinancialSummary } from "@/components/dashboard/financial-summary"
import Loading from "@/components/loading/loading-component"
import { useTransactions } from "@/hooks/use-transaction"
import { DashboardSEO } from "@/components/dashboard/dashboard-seo"

export default function DashboardPage() {
  const { transactions, loading, error } = useTransactions()

  if (loading) {
    return (
      <>
        <DashboardSEO 
          title="Dashboard Keuangan" 
          description="Lihat ringkasan keuangan Anda, termasuk pemasukan, pengeluaran, dan saldo terkini."
        />
        <Loading />
      </>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error: {error}</p>
      </div>
    )
  }

  return (
    <>
      <DashboardSEO 
        title="Dashboard Keuangan" 
        description="Lihat ringkasan keuangan Anda, termasuk pemasukan, pengeluaran, dan saldo terkini."
      />
      <FinancialSummary transactions={transactions} />
    </>
  )
}
