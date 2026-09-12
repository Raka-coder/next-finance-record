"use client"

import { TransactionList } from "@/components/dashboard/transaction-list"
import Loading from "@/components/loading/loading-component"
import { useTransactions } from "@/hooks/use-transaction"

export function TransactionListView() {
  const { transactions, loading, error, addTransaction, updateTransaction, deleteTransaction } = useTransactions()

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
    <TransactionList
      transactions={transactions}
      onUpdateTransaction={updateTransaction}
      onDeleteTransaction={deleteTransaction}
      onAddTransaction={addTransaction}
    />
  )
}
