"use client"

import { TransactionList } from "@/components/dashboard/transaction-list"
import Loading from "@/components/loading/loading-component"
import { useTransactions } from "@/hooks/use-transaction"
import { DashboardSEO } from "@/components/dashboard/dashboard-seo"

export default function DaftarTransaksiPage() {
  const { transactions, loading, error, updateTransaction, deleteTransaction } = useTransactions()

  if (loading) {
    return (
      <>
        <DashboardSEO 
          title="Daftar Transaksi" 
          description="Lihat dan kelola semua transaksi keuangan Anda dalam satu tempat."
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
        title="Daftar Transaksi" 
        description="Lihat dan kelola semua transaksi keuangan Anda dalam satu tempat."
      />
      <TransactionList
        transactions={transactions}
        onUpdateTransaction={updateTransaction}
        onDeleteTransaction={deleteTransaction}
      />
    </>
  )
}
