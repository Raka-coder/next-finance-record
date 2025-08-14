"use client"

import React, { useState, useMemo, useCallback, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import type { Transaction } from "@/types/transaction"
import { format, parseISO, startOfDay, endOfDay, addDays } from 'date-fns'
import { id } from 'date-fns/locale'
import { DeleteTransactionDialog } from "@/components/dialog/delete-transaction-dialog"
import { TransactionListHeader } from "./transaction-list/transaction-list-header"
import { TransactionStats } from "./transaction-list/transaction-stats"
import { TransactionTable } from "./transaction-list/transaction-table"
import { EditTransactionDialog } from "./transaction-list/edit-transaction-dialog"
import { TransactionPagination } from "./transaction-list/transaction-pagination"

interface TransactionListProps {
  transactions: Transaction[]
  onUpdateTransaction: (id: string, transaction: Omit<Transaction, "id">) => void
  onDeleteTransaction: (id: string) => void
}

const incomeCategories = ["Gaji", "Freelance", "Investasi", "Bonus", "Lainnya"]
const expenseCategories = ["Makanan", "Transportasi", "Belanja", "Tagihan", "Hiburan", "Kesehatan", "Lainnya"]

interface WeekGroup {
  weekStart: Date
  weekEnd: Date
  transactions: Transaction[]
  weekNumber: number
  label: string
}

export function TransactionList({ transactions, onUpdateTransaction, onDeleteTransaction }: TransactionListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  // Helper functions
  const formatWeekRange = useCallback((weekStart: Date, weekEnd: Date) => {
    // If same date, show single date
    if (format(weekStart, 'yyyy-MM-dd') === format(weekEnd, 'yyyy-MM-dd')) {
      return format(weekStart, 'dd MMM yyyy', { locale: id })
    }

    // If same month, show "1-7 Jan 2024"
    if (format(weekStart, 'yyyy-MM') === format(weekEnd, 'yyyy-MM')) {
      return `${format(weekStart, 'dd', { locale: id })}-${format(weekEnd, 'dd MMM yyyy', { locale: id })}`
    }

    // If different months, show "28 Jan - 3 Feb 2024"
    return `${format(weekStart, 'dd MMM', { locale: id })} - ${format(weekEnd, 'dd MMM yyyy', { locale: id })}`
  }, [])

  const formatCurrency = useCallback((amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }, [])

  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }, [])

  // Filter transactions based on search term
  const filteredTransactions = useMemo(() => {
    return transactions.filter(
      (transaction) =>
        transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.category.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }, [transactions, searchTerm])

  // Group transactions by 7-day periods
  const weekGroups = useMemo(() => {
    if (filteredTransactions.length === 0) return []

    // Sort transactions by date (newest first)
    const sortedTransactions = [...filteredTransactions].sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )

    // Get the date range
    const oldestDate = startOfDay(parseISO(sortedTransactions[sortedTransactions.length - 1].date))
    const newestDate = startOfDay(parseISO(sortedTransactions[0].date))

    const groups: WeekGroup[] = []
    let currentStart = oldestDate
    let weekNumber = 1

    // Create 7-day groups starting from the oldest transaction date
    while (currentStart <= newestDate) {
      const currentEnd = endOfDay(addDays(currentStart, 6))

      // Find transactions in this 7-day period
      const weekTransactions = sortedTransactions.filter((transaction) => {
        const transactionDate = startOfDay(parseISO(transaction.date))
        return transactionDate >= currentStart && transactionDate <= currentEnd
      })

      // Only create group if there are transactions in this period
      if (weekTransactions.length > 0) {
        const actualStart = startOfDay(parseISO(weekTransactions[weekTransactions.length - 1].date))
        const actualEnd = startOfDay(parseISO(weekTransactions[0].date))

        groups.push({
          weekStart: actualStart,
          weekEnd: actualEnd,
          transactions: weekTransactions,
          weekNumber: weekNumber,
          label: formatWeekRange(actualStart, actualEnd)
        })
        weekNumber++
      }

      // Move to next 7-day period
      currentStart = addDays(currentStart, 7)
    }

    return groups.reverse() // Show newest periods first
  }, [filteredTransactions, formatWeekRange])

  const totalPages = weekGroups.length
  const shouldShowPagination = totalPages > 1

  // Get current page transactions
  const currentPageData = weekGroups[currentPage - 1]
  const currentPageTransactions = currentPageData?.transactions || []

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  // Adjust current page if it exceeds total pages
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  const handleEdit = useCallback((transaction: Transaction) => {
    setEditingTransaction(transaction)
  }, [])

  const handleUpdate = useCallback(async (data: any) => {
    if (!editingTransaction) return

    if (!isFormChanged) {
      toast.message("Tidak ada perubahan pada transaksi")
      return
    }

    try {
      await onUpdateTransaction(editingTransaction.id, {
        type: data.type,
        amount: Number.parseFloat(data.amount),
        description: data.description,
        category: data.category,
        date: format(data.date, "yyyy-MM-dd"),
        created_at: editingTransaction.created_at,
        updated_at: new Date().toISOString(),
      })

      setEditingTransaction(null)
      toast.success("Transaksi berhasil diperbarui!")
    } catch (error) {
      toast.error("Gagal memperbarui transaksi")
    }
  }, [editingTransaction, onUpdateTransaction])

  const handleDelete = useCallback((id: string) => {
    setDeletingId(id)
    setDeleteDialogOpen(true)
  }, [])

  const handleConfirmDelete = useCallback(async () => {
    if (!deletingId) return
    setDeleteLoading(true)
    await onDeleteTransaction(deletingId)
    setDeleteLoading(false)
    setDeleteDialogOpen(false)
    setDeletingId(null)
    toast.success("Transaksi berhasil dihapus!")
  }, [deletingId, onDeleteTransaction])

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
  }, [])

  // Generate page numbers for pagination
  const getPageNumbers = useCallback(() => {
    const pages = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i)
        }
        pages.push('ellipsis')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1)
        pages.push('ellipsis')
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        pages.push(1)
        pages.push('ellipsis')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push('ellipsis')
        pages.push(totalPages)
      }
    }

    return pages
  }, [totalPages, currentPage])

  // Calculate page statistics
  const pageStats = useMemo(() => {
    if (!currentPageData) return { income: 0, expense: 0, balance: 0, count: 0 }

    const income = currentPageData.transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)

    const expense = currentPageData.transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)

    return {
      income,
      expense,
      balance: income - expense,
      count: currentPageData.transactions.length
    }
  }, [currentPageData])

  // Fungsi untuk membandingkan dua objek transaksi
  const isTransactionChanged = useCallback((original: any, current: any): boolean => {
    // Bandingkan setiap field yang relevan
    if (original.amount !== current.amount) return true
    if (original.date !== current.date) return true
    if (original.category !== current.category) return true
    if (original.description !== current.description) return true
    if (original.type !== current.type) return true
    return false
  }, [])

  const originalData = editingTransaction ? {
    ...editingTransaction,
    amount: editingTransaction.amount.toString(),
    date: format(new Date(editingTransaction.date), 'yyyy-MM-dd'),
  } : {}

  const currentData = {
    type: editingTransaction?.type || "income",
    amount: editingTransaction?.amount.toString() || "",
    description: editingTransaction?.description || "",
    category: editingTransaction?.category || "",
    date: editingTransaction?.date || new Date().toISOString(),
  }

  const isFormChanged = isTransactionChanged(originalData, currentData)
  const categories = editingTransaction?.type === "income" ? incomeCategories : expenseCategories

  return (
    <div className="space-y-6">
      <Card>
        <TransactionListHeader
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filteredTransactionsCount={filteredTransactions.length}
          totalPages={totalPages}
          currentPage={currentPage}
          currentPageLabel={currentPageData?.label}
          shouldShowPagination={shouldShowPagination}
        />
        
        <CardContent>
          {/* Page Statistics */}
          {currentPageData && (
            <TransactionStats
              income={pageStats.income}
              expense={pageStats.expense}
              balance={pageStats.balance}
              count={pageStats.count}
              formatCurrency={formatCurrency}
            />
          )}

          <div className="rounded-md border">
            <TransactionTable
              transactions={currentPageTransactions}
              formatDate={formatDate}
              formatCurrency={formatCurrency}
              onEdit={handleEdit}
              onDelete={handleDelete}
              searchTerm={searchTerm}
              filteredTransactionsCount={filteredTransactions.length}
              currentPageLabel={currentPageData?.label}
              shouldShowPagination={shouldShowPagination}
            />
            
            <DeleteTransactionDialog
              open={deleteDialogOpen}
              onOpenChange={setDeleteDialogOpen}
              onDelete={handleConfirmDelete}
              loading={deleteLoading}
            />
            
            <EditTransactionDialog
              open={!!editingTransaction}
              onOpenChange={(open) => !open && setEditingTransaction(null)}
              transaction={editingTransaction}
              onUpdate={handleUpdate}
              isSubmitting={false}
              isFormChanged={isFormChanged}
              categories={categories}
            />
          </div>

          {/* 7-day Period Pagination - Only show if more than 1 period */}
          <TransactionPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            getPageNumbers={getPageNumbers as () => (number | "ellipsis")[]}
            currentPageTransactionsCount={currentPageTransactions.length}
            currentPageLabel={currentPageData?.label}
          />
        </CardContent>
      </Card>
    </div>
  )
}