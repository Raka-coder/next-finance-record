"use client"

import { useMemo } from "react"
import Link from "next/link"
import type { Transaction } from "@/interfaces/transaction-interface"
import { SummaryCards } from "./financial-summary/summary-cards"
import { PieChartsSection } from "./financial-summary/pie-charts-section"
import { CategoryBreakdown } from "./financial-summary/category-breakdown"
import { RecentTransactionsCard } from "./financial-summary/recent-transactions-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, ReceiptText } from "lucide-react"

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
    if (!transactions || transactions.length === 0) {
      return {
        topExpenseCategories: [],
        topIncomeCategories: [],
        expensePieData: [],
        incomePieData: [],
        totalIncome: 0,
        totalExpense: 0,
      }
    }

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
      totalExpense,
    }
  }, [transactions])

  if (!transactions) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-sm text-muted-foreground animate-pulse">Memuat ringkasan keuangan...</div>
      </div>
    )
  }

  // Composed Onboarding Empty State when user has 0 transactions
  if (transactions.length === 0) {
    return (
      <div className="space-y-6">
        <SummaryCards transactions={transactions} formatCurrency={formatCurrency} />

        <Card className="border-dashed border-2 bg-card/40 backdrop-blur-sm">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center px-4">
            <div className="size-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-4 shadow-sm">
              <ReceiptText className="size-7" />
            </div>
            <h3 className="text-xl font-bold tracking-tight">Belum Ada Transaksi Tercatat</h3>
            <p className="text-muted-foreground text-sm max-w-md mt-1 mb-6">
              Mulai kelola keuangan Anda dengan mencatat pemasukan gaji, usaha, atau pengeluaran harian pertama Anda sekarang.
            </p>
            <Button asChild size="lg" className="font-semibold shadow-sm">
              <Link href="/dashboard/add-transaction" className="inline-flex items-center gap-2">
                <Plus className="size-4" />
                Catat Transaksi Pertama
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Bento Summary Cards */}
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
