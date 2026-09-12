"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Wallet, PiggyBank, ArrowUpRight, ArrowDownRight } from "lucide-react"
import type { Transaction } from "@/interfaces/transaction-interface"
import type { MonthOverMonthData } from "@/services/analytics.service"

type SummaryCardsProps = {
  transactions: Transaction[]
  formatCurrency: (amount: number) => string
  momData?: MonthOverMonthData | null
}

export function SummaryCards({ transactions, formatCurrency, momData }: SummaryCardsProps) {
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0)

  const balance = totalIncome - totalExpense
  const savingsRate = totalIncome > 0 ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100) : 0
  const incomeCount = transactions.filter((t) => t.type === "income").length
  const expenseCount = transactions.filter((t) => t.type === "expense").length

  const splitCurrency = (amount: number) => {
    const isNegative = amount < 0
    const absVal = Math.abs(amount)
    const formatted = new Intl.NumberFormat("id-ID", {
      minimumFractionDigits: 0,
    }).format(absVal)
    return {
      prefix: isNegative ? "-Rp" : "Rp",
      number: formatted,
    }
  }

  const balanceParts = splitCurrency(balance)
  const incomeParts = splitCurrency(totalIncome)
  const expenseParts = splitCurrency(totalExpense)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Saldo Bersih Hero Card - Spans 2 cols */}
      <Card className="md:col-span-2 relative overflow-hidden bg-card/75 backdrop-blur-sm border-border/70 rounded-2xl shadow-sm">
        <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <div className="space-y-1">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Saldo Bersih Akumulasi
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Total likuiditas finansial bersih Anda saat ini
            </p>
          </div>
          <div className="size-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
            <Wallet className="size-5" />
          </div>
        </CardHeader>

        <CardContent className="pt-2">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            {/* Unit:Number 2:1 ratio */}
            <div className="flex items-baseline font-mono">
              <span className="text-lg sm:text-xl font-semibold text-muted-foreground mr-1.5 select-none">
                {balanceParts.prefix}
              </span>
              <span className="text-3xl sm:text-4xl font-extrabold tracking-tight tabular-nums text-foreground">
                {balanceParts.number}
              </span>
            </div>

            <div className="flex items-center gap-1.5 self-start sm:self-auto">
              {balance >= 0 ? (
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full text-xs font-medium">
                  <ArrowUpRight className="size-3.5" /> Surplus
                </span>
              ) : (
                <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-0.5 rounded-full text-xs font-medium">
                  <ArrowDownRight className="size-3.5" /> Defisit
                </span>
              )}

              {momData && (
                <span className="text-[11px] font-mono text-muted-foreground hidden sm:inline">
                  {momData.deltas.netDelta >= 0 ? "+" : ""}
                  {formatCurrency(momData.deltas.netDelta)} MoM
                </span>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
            <span>{transactions.length} total transaksi tercatat</span>
            {momData ? (
              <span className="font-mono">
                Bulan ini: {formatCurrency(momData.current.net)}
              </span>
            ) : (
              <span className="font-mono">{savingsRate}% rasio tabungan</span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 2. Total Pemasukan Card */}
      <Card className="bg-card/75 backdrop-blur-sm border-border/70 rounded-2xl shadow-sm flex flex-col justify-between">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Pemasukan
          </CardTitle>
          <div className="size-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
            <TrendingUp className="size-4" />
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          {/* Unit:Number 2:1 ratio */}
          <div className="flex items-baseline font-mono text-emerald-600 dark:text-emerald-400">
            <span className="text-sm font-semibold opacity-75 mr-1 select-none">
              {incomeParts.prefix}
            </span>
            <span className="text-2xl font-bold tracking-tight tabular-nums">
              {incomeParts.number}
            </span>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">{incomeCount} catatan</span>
            {momData && (
              <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px] py-0 px-1.5 rounded-full gap-0.5">
                {momData.deltas.incomePercent >= 0 ? "+" : ""}
                {momData.deltas.incomePercent}% MoM
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 3. Total Pengeluaran Card */}
      <Card className="bg-card/75 backdrop-blur-sm border-border/70 rounded-2xl shadow-sm flex flex-col justify-between">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Pengeluaran
          </CardTitle>
          <div className="size-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0">
            <TrendingDown className="size-4" />
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          {/* Unit:Number 2:1 ratio */}
          <div className="flex items-baseline font-mono text-rose-600 dark:text-rose-400">
            <span className="text-sm font-semibold opacity-75 mr-1 select-none">
              {expenseParts.prefix}
            </span>
            <span className="text-2xl font-bold tracking-tight tabular-nums">
              {expenseParts.number}
            </span>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">{expenseCount} catatan</span>
            {momData && (
              <Badge className="bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30 text-[10px] py-0 px-1.5 rounded-full gap-0.5">
                {momData.deltas.expensePercent > 0 ? "+" : ""}
                {momData.deltas.expensePercent}% MoM
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 4. Rasio Tabungan Sub-Card (Eliminating rogue blue-600) */}
      <div className="lg:col-span-4">
        <div className="bg-card/75 backdrop-blur-sm border border-border/70 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
              <PiggyBank className="size-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-foreground">
                Rasio Tabungan Finansial
              </p>
              <p className="text-xs text-muted-foreground">
                Proporsi dana tersisa yang berhasil diamankan dari akumulasi pemasukan
              </p>
            </div>
          </div>
          <div className="w-full sm:w-72 space-y-1.5">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-muted-foreground">
                {savingsRate >= 20 ? "Kondisi sangat sehat (>20%)" : savingsRate > 0 ? "Cukup baik" : "Defisit tabungan"}
              </span>
              <span className="font-semibold text-foreground text-sm">{savingsRate}%</span>
            </div>
            <Progress value={Math.max(0, Math.min(savingsRate, 100))} className="h-2" />
          </div>
        </div>
      </div>
    </div>
  )
}