"use client"

import { useMemo, useState } from "react"
import type { Transaction } from "@/interfaces/transaction-interface"
import { SummaryCards } from "./financial-summary/summary-cards"
import { PieChartsSection } from "./financial-summary/pie-charts-section"
import { CategoryBreakdown } from "./financial-summary/category-breakdown"
import { RecentTransactionsCard } from "./financial-summary/recent-transactions-card"
import { AddTransactionDialog } from "./transaction/add-transaction-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

import type { MonthOverMonthData, MonthlyTrendPoint } from "@/services/analytics.service"
import { CashflowTrendChart } from "./analytics/cashflow-trend-chart"

interface FinancialSummaryProps {
  transactions: Transaction[]
  onAddTransaction?: (
    transaction: Omit<Transaction, "id" | "user_id" | "created_at" | "updated_at">
  ) => Promise<Transaction>
  momData?: MonthOverMonthData | null
  sixMonthTrend?: MonthlyTrendPoint[]
}

export function FinancialSummary({
  transactions,
  onAddTransaction,
  momData,
  sixMonthTrend,
}: FinancialSummaryProps) {
  const [addDialogOpen, setAddDialogOpen] = useState(false)

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
      <div className="flex justify-center items-center h-48">
        <div className="text-xs font-mono text-muted-foreground">Memuat data...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Editorial Header Section with Single Primary Action */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="text-[11px] font-mono text-muted-foreground uppercase tracking-widest mb-1">
            Buku Kas
          </div>
          <h1 className="text-2xl font-medium tracking-tight text-foreground">
            Ringkasan Keuangan
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Ikhtisar posisi kas masuk, kas keluar, dan alokasi kategori.
          </p>
        </div>

        {onAddTransaction && (
          <Button
            onClick={() => setAddDialogOpen(true)}
            size="default"
            className="self-start sm:self-auto font-mono text-xs cursor-pointer"
          >
            + Catat Transaksi
          </Button>
        )}
      </div>

      {/* Modal Dialog Form Transaksi */}
      {onAddTransaction && (
        <AddTransactionDialog
          open={addDialogOpen}
          onOpenChange={setAddDialogOpen}
          onAddTransaction={onAddTransaction}
        />
      )}

      {/* Empty State jika belum ada transaksi */}
      {transactions.length === 0 ? (
        <div className="space-y-6">
          <SummaryCards
            transactions={transactions}
            formatCurrency={formatCurrency}
          />

          <Card className="border border-dashed border-border bg-card p-12 text-center">
            <CardContent className="p-0 flex flex-col items-center">
              <div className="size-8 rounded-[4px] bg-secondary border border-border flex items-center justify-center font-mono text-xs text-foreground mb-3">
                0
              </div>
              <h3 className="text-sm font-semibold text-foreground">Belum Ada Transaksi</h3>
              <p className="text-xs text-muted-foreground max-w-xs mt-1 mb-4">
                Buku kas ini masih kosong. Mulai dengan mencatat transaksi pertama Anda.
              </p>
              {onAddTransaction && (
                <Button size="sm" onClick={() => setAddDialogOpen(true)} className="font-mono text-xs">
                  + Catat Transaksi Pertama
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Bento Summary Cards */}
          <SummaryCards
            transactions={transactions}
            formatCurrency={formatCurrency}
          />

          {/* Six Month Cashflow Trend */}
          {sixMonthTrend && sixMonthTrend.length > 0 && (
            <CashflowTrendChart data={sixMonthTrend} />
          )}

          {/* Category Breakdown */}
          <CategoryBreakdown 
            topExpenseCategories={financialData.topExpenseCategories}
            topIncomeCategories={financialData.topIncomeCategories}
            totalExpense={financialData.totalExpense}
            totalIncome={financialData.totalIncome}
            formatCurrency={formatCurrency}
          />

          {/* Pie Charts Section */}
          <PieChartsSection 
            incomePieData={financialData.incomePieData} 
            expensePieData={financialData.expensePieData} 
          />

          {/* Recent Transactions */}
          <RecentTransactionsCard
            transactions={transactions}
            formatCurrency={formatCurrency}
          />
        </div>
      )}
    </div>
  )
}
