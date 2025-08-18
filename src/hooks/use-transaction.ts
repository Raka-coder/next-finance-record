"use client"

import { useState, useEffect } from "react"
import { TransactionService } from "@/services/transaction.service"
import type { Transaction, TransactionInput } from "@/interfaces/transaction-interface"

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTransactions = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await TransactionService.getTransactions()
      setTransactions(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const addTransaction = async (transaction: TransactionInput) => {
    try {
      const newTransaction = await TransactionService.addTransaction(transaction)
      setTransactions((prev) => [newTransaction, ...prev])
      return newTransaction
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add transaction")
      throw err
    }
  }

  const updateTransaction = async (id: string, transaction: TransactionInput) => {
    try {
      const updatedTransaction = await TransactionService.updateTransaction(id, transaction)
      setTransactions((prev) => prev.map((t) => (t.id === id ? updatedTransaction : t)))
      return updatedTransaction
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update transaction")
      throw err
    }
  }

  const deleteTransaction = async (id: string) => {
    try {
      await TransactionService.deleteTransaction(id)
      setTransactions((prev) => prev.filter((t) => t.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete transaction")
      throw err
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [])

  return {
    transactions,
    loading,
    error,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    refetch: fetchTransactions,
  }
}
