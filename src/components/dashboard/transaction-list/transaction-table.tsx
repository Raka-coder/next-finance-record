"use client"

import React from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import type { Transaction } from "@/interfaces/transaction-interface"

interface TransactionTableProps {
  transactions: Transaction[]
  formatDate: (dateString: string) => string
  formatCurrency: (amount: number) => string
  onEdit: (transaction: Transaction) => void
  onDelete: (id: string) => void
  searchTerm: string
  filteredTransactionsCount: number
  currentPageLabel?: string
  shouldShowPagination: boolean
}

export function TransactionTable({
  transactions,
  formatDate,
  formatCurrency,
  onEdit,
  onDelete,
  searchTerm,
  filteredTransactionsCount,
  currentPageLabel,
  shouldShowPagination,
}: TransactionTableProps) {
  return (
    <div className="rounded-[4px] border border-border overflow-hidden bg-card">
      <Table>
        <TableHeader className="bg-secondary/60">
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="w-[120px] font-mono text-[11px] uppercase tracking-wider text-muted-foreground">Tanggal</TableHead>
            <TableHead className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">Deskripsi</TableHead>
            <TableHead className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">Kategori</TableHead>
            <TableHead className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">Jenis</TableHead>
            <TableHead className="text-right font-mono text-[11px] uppercase tracking-wider text-muted-foreground">Jumlah</TableHead>
            <TableHead className="text-right w-[110px] font-mono text-[11px] uppercase tracking-wider text-muted-foreground">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.length === 0 ? (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={6} className="text-center py-12 text-muted-foreground font-mono text-xs">
                {filteredTransactionsCount === 0 && searchTerm
                  ? "Tidak ada transaksi yang cocok dengan kueri pencarian."
                  : shouldShowPagination && currentPageLabel
                    ? `Tidak ada transaksi pada periode ${currentPageLabel}.`
                    : "Belum ada transaksi ditemukan."}
              </TableCell>
            </TableRow>
          ) : (
            transactions.map((transaction) => {
              const isIncome = transaction.type === "income"
              return (
                <TableRow key={transaction.id} className="border-border hover:bg-muted/30 transition-colors">
                  <TableCell className="text-xs text-muted-foreground font-mono">
                    {formatDate(transaction.date)}
                  </TableCell>
                  <TableCell className="font-medium text-foreground text-xs">
                    {transaction.description}
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-[3px] text-[11px] font-mono text-muted-foreground bg-muted/60 border border-border/80">
                      {transaction.category}
                    </span>
                  </TableCell>
                  <TableCell>
                    {isIncome ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-medium tracking-wide uppercase border border-[#D0E6CD] bg-[#EDF3EC] text-[#346538] dark:border-[#224424] dark:bg-[#1A2E1C] dark:text-[#81C784]">
                        Pemasukan
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-medium tracking-wide uppercase border border-[#F5C2C7] bg-[#FDEBEC] text-[#9F2F2D] dark:border-[#5C2323] dark:bg-[#321B1B] dark:text-[#F87171]">
                        Pengeluaran
                      </span>
                    )}
                  </TableCell>
                  <TableCell
                    className={`text-right font-mono text-xs font-medium tabular-nums ${
                      isIncome ? "text-[#346538] dark:text-[#81C784]" : "text-[#9F2F2D] dark:text-[#F87171]"
                    }`}
                  >
                    {isIncome ? "+" : "-"}
                    {formatCurrency(transaction.amount)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(transaction)}
                        className="h-6 px-2 text-[11px] font-mono text-muted-foreground hover:text-foreground"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(transaction.id)}
                        className="h-6 px-2 text-[11px] font-mono text-[#9F2F2D] dark:text-[#F87171] hover:bg-[#FDEBEC] dark:hover:bg-[#321B1B]"
                      >
                        Hapus
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
    </div>
  )
}