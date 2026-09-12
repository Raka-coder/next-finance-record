"use client"

import { AddTransaction } from "@/components/dashboard/add-transaction"
import { useTransactions } from "@/hooks/use-transaction"
import { useRouter } from "next/navigation"
import type { Transaction } from "@/interfaces/transaction-interface"

export function AddTransactionView() {
  const { addTransaction } = useTransactions()
  const router = useRouter()

  const handleAddTransaction = async (
    transaction: Omit<Transaction, "id" | "user_id" | "created_at" | "updated_at">
  ) => {
    const result = await addTransaction(transaction)
    router.push("/dashboard")
    return result
  }

  return <AddTransaction onAddTransaction={handleAddTransaction} />
}
