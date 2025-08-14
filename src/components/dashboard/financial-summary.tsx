"use client"

import { useMemo } from "react"
import type { Transaction } from "@/types/transaction"
import { SummaryCards } from "./financial-summary/summary-cards"
import { PieChartsSection } from "./financial-summary/pie-charts-section"
import { CategoryBreakdown } from "./financial-summary/category-breakdown"
import { RecentTransactionsCard } from "./financial-summary/recent-transactions-card"

interface FinancialSummaryProps {
  transactions: Transaction[]
}

export function FinancialSummary({ transactions }: FinancialSummaryProps) {
  const formatCurrency = useMemo(() => {
    return (amount: number) => {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(amount)
    }
  }, [])

  const financialData = useMemo(() => {
    // Handle case when transactions is null or undefined
    if (!transactions || transactions.length === 0) {
      return {
        topExpenseCategories: [],
        topIncomeCategories: [],
        expensePieData: [],
        incomePieData: [],
        totalIncome: 0,
        totalExpense: 0
      }
    }

    // Kategori pengeluaran terbesar
    const expensesByCategory = transactions
      .filter((t) => t.type === "expense")
      .reduce(
        (acc, t) => {
          acc[t.category] = (acc[t.category] || 0) + t.amount
          return acc
        },
        {} as Record<string, number>,
      )

    const topExpenseCategories = Object.entries(expensesByCategory)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)

    // Kategori pemasukan terbesar
    const incomesByCategory = transactions
      .filter((t) => t.type === "income")
      .reduce(
        (acc, t) => {
          acc[t.category] = (acc[t.category] || 0) + t.amount
          return acc
        },
        {} as Record<string, number>,
      )

    const topIncomeCategories = Object.entries(incomesByCategory)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)

    // Prepare data for pie charts
    const expensePieData = Object.entries(expensesByCategory).map(([category, amount]) => ({
      name: category,
      y: amount,
    }))

    const incomePieData = Object.entries(incomesByCategory).map(([category, amount]) => ({
      name: category,
      y: amount,
    }))

    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0)

    const totalExpense = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0)

    return {
      topExpenseCategories,
      topIncomeCategories,
      expensePieData,
      incomePieData,
      totalIncome,
      totalExpense
    }
  }, [transactions])

  // Handle case when transactions is null or undefined
  if (!transactions) {
    return (
      <div className="flex justify-center items-center h-64">
        <div>Loading transactions...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <SummaryCards transactions={transactions} formatCurrency={formatCurrency} />

      {/* Pie Charts Section */}
      <PieChartsSection 
        incomePieData={financialData.incomePieData} 
        expensePieData={financialData.expensePieData} 
      />

      {/* Category Breakdown */}
      <CategoryBreakdown 
        topExpenseCategories={financialData.topExpenseCategories}
        topIncomeCategories={financialData.topIncomeCategories}
        totalExpense={financialData.totalExpense}
        totalIncome={financialData.totalIncome}
        formatCurrency={formatCurrency}
      />

      {/* Recent Transactions */}
      <RecentTransactionsCard transactions={transactions} formatCurrency={formatCurrency} />
    </div>
  )
}
