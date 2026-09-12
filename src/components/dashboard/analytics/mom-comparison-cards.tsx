"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown, DollarSign, PiggyBank } from "lucide-react"
import type { MonthOverMonthData } from "@/services/analytics.service"

interface MomComparisonCardsProps {
  data: MonthOverMonthData
}

export function MomComparisonCards({ data }: MomComparisonCardsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const { current, previous, deltas } = data

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total Pemasukan */}
      <Card className="border-border/60 shadow-xs">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xs font-medium text-muted-foreground">Pemasukan Bulan Ini</CardTitle>
          <div className="p-1.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <TrendingUp className="size-4" />
          </div>
        </CardHeader>
        <CardContent className="space-y-1.5">
          <div className="text-xl font-bold font-mono tabular-nums text-foreground">
            {formatCurrency(current.income)}
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            {deltas.incomePercent >= 0 ? (
              <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px] py-0 px-1 gap-0.5">
                <ArrowUpRight className="size-3" />+{deltas.incomePercent}%
              </Badge>
            ) : (
              <Badge className="bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30 text-[10px] py-0 px-1 gap-0.5">
                <ArrowDownRight className="size-3" />{deltas.incomePercent}%
              </Badge>
            )}
            <span className="text-muted-foreground">vs bulan lalu ({formatCurrency(previous.income)})</span>
          </div>
        </CardContent>
      </Card>

      {/* 2. Total Pengeluaran */}
      <Card className="border-border/60 shadow-xs">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xs font-medium text-muted-foreground">Pengeluaran Bulan Ini</CardTitle>
          <div className="p-1.5 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400">
            <TrendingDown className="size-4" />
          </div>
        </CardHeader>
        <CardContent className="space-y-1.5">
          <div className="text-xl font-bold font-mono tabular-nums text-rose-500">
            {formatCurrency(current.expense)}
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            {deltas.expensePercent > 0 ? (
              <Badge className="bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30 text-[10px] py-0 px-1 gap-0.5">
                <ArrowUpRight className="size-3" />+{deltas.expensePercent}%
              </Badge>
            ) : (
              <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px] py-0 px-1 gap-0.5">
                <ArrowDownRight className="size-3" />{deltas.expensePercent}%
              </Badge>
            )}
            <span className="text-muted-foreground">vs bulan lalu ({formatCurrency(previous.expense)})</span>
          </div>
        </CardContent>
      </Card>

      {/* 3. Saldo Bersih Bulanan */}
      <Card className="border-border/60 shadow-xs">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xs font-medium text-muted-foreground">Arus Kas Bersih (Net)</CardTitle>
          <div className="p-1.5 rounded-md bg-primary/10 text-primary">
            <DollarSign className="size-4" />
          </div>
        </CardHeader>
        <CardContent className="space-y-1.5">
          <div
            className={`text-xl font-bold font-mono tabular-nums ${
              current.net >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-500"
            }`}
          >
            {current.net >= 0 ? "+" : ""}
            {formatCurrency(current.net)}
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span>Perubahan:</span>
            <span
              className={`font-mono font-medium ${
                deltas.netDelta >= 0 ? "text-emerald-600" : "text-rose-500"
              }`}
            >
              {deltas.netDelta >= 0 ? "+" : ""}
              {formatCurrency(deltas.netDelta)}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* 4. Rasio Tabungan (Savings Rate) */}
      <Card className="border-border/60 shadow-xs">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xs font-medium text-muted-foreground">Rasio Tabungan</CardTitle>
          <div className="p-1.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <PiggyBank className="size-4" />
          </div>
        </CardHeader>
        <CardContent className="space-y-1.5">
          <div className="text-xl font-bold font-mono tabular-nums text-foreground">
            {current.savingsRate}%
          </div>
          <p className="text-xs text-muted-foreground">
            {current.savingsRate >= 20
              ? "Kondisi sangat sehat (>20%)"
              : current.savingsRate > 0
              ? "Cukup baik, tingkatkan lagi"
              : "Defisit / tidak ada tabungan"}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
