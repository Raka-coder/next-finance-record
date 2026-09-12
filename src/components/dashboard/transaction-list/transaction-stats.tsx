"use client"

import React from "react"
import { TrendingUp, TrendingDown, Wallet, Hash } from "lucide-react"

interface TransactionStatsProps {
  income: number
  expense: number
  balance: number
  count: number
  formatCurrency: (amount: number) => string
}

export function TransactionStats({
  income,
  expense,
  balance,
  count,
  formatCurrency,
}: TransactionStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 p-3 bg-muted/40 rounded-xl border border-border/60">
      <div className="p-2.5 rounded-lg bg-background/60 border border-border/40">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
          <TrendingUp className="size-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Pemasukan</span>
        </div>
        <div className="font-mono text-base font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
          {formatCurrency(income)}
        </div>
      </div>

      <div className="p-2.5 rounded-lg bg-background/60 border border-border/40">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
          <TrendingDown className="size-3.5 text-rose-600 dark:text-rose-400" />
          <span>Pengeluaran</span>
        </div>
        <div className="font-mono text-base font-bold text-rose-600 dark:text-rose-400 tabular-nums">
          {formatCurrency(expense)}
        </div>
      </div>

      <div className="p-2.5 rounded-lg bg-background/60 border border-border/40">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
          <Wallet className="size-3.5 text-muted-foreground" />
          <span>Saldo Periode</span>
        </div>
        <div
          className={`font-mono text-base font-bold tabular-nums ${
            balance >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
          }`}
        >
          {formatCurrency(balance)}
        </div>
      </div>

      <div className="p-2.5 rounded-lg bg-background/60 border border-border/40">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
          <Hash className="size-3.5 text-blue-500" />
          <span>Total Transaksi</span>
        </div>
        <div className="font-mono text-base font-bold text-foreground tabular-nums">
          {count} <span className="text-xs font-normal text-muted-foreground font-sans">catatan</span>
        </div>
      </div>
    </div>
  )
}