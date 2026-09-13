"use client"

import React from "react"

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
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4 p-3 bg-secondary/60 rounded-[4px] border border-border">
      <div className="p-2">
        <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-0.5">
          Pemasukan
        </div>
        <div className="font-mono text-sm font-medium text-foreground tabular-nums">
          {formatCurrency(income)}
        </div>
      </div>

      <div className="p-2">
        <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-0.5">
          Pengeluaran
        </div>
        <div className="font-mono text-sm font-medium text-foreground tabular-nums">
          {formatCurrency(expense)}
        </div>
      </div>

      <div className="p-2">
        <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-0.5">
          Saldo Periode
        </div>
        <div
          className={`font-mono text-sm font-medium tabular-nums ${
            balance >= 0 ? "text-[#346538] dark:text-[#81C784]" : "text-[#9F2F2D] dark:text-[#F87171]"
          }`}
        >
          {formatCurrency(balance)}
        </div>
      </div>

      <div className="p-2">
        <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-0.5">
          Volume
        </div>
        <div className="font-mono text-sm font-medium text-foreground tabular-nums">
          {count} <span className="text-[10px] text-muted-foreground">entri</span>
        </div>
      </div>
    </div>
  )
}