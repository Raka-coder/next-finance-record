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
  formatCurrency
}: TransactionStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-muted/50 rounded-lg">
      <div className="text-center">
        <div className="text-lg font-semibold text-green-500">
          {formatCurrency(income)}
        </div>
        <div className="text-xs text-muted-foreground">Pemasukan Periode Ini</div>
      </div>
      <div className="text-center">
        <div className="text-lg font-semibold text-red-500">
          {formatCurrency(expense)}
        </div>
        <div className="text-xs text-muted-foreground">Pengeluaran Periode Ini</div>
      </div>
      <div className="text-center">
        <div className={`text-lg font-semibold ${balance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {formatCurrency(balance)}
        </div>
        <div className="text-xs text-muted-foreground">Saldo Periode Ini</div>
      </div>
      <div className="text-center">
        <div className="text-lg font-semibold text-blue-500">
          {count}
        </div>
        <div className="text-xs text-muted-foreground">Total Transaksi</div>
      </div>
    </div>
  )
}