"use client"

import React from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, ArrowUpRight, ArrowDownRight } from "lucide-react"
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
    <div className="rounded-xl border border-border/80 overflow-hidden bg-card/60 backdrop-blur-sm shadow-sm">
      <Table>
        <TableHeader className="bg-muted/40">
          <TableRow>
            <TableHead className="w-[130px] font-semibold">Tanggal</TableHead>
            <TableHead className="font-semibold">Deskripsi</TableHead>
            <TableHead className="font-semibold">Kategori</TableHead>
            <TableHead className="font-semibold">Jenis</TableHead>
            <TableHead className="text-right font-semibold">Jumlah</TableHead>
            <TableHead className="text-center w-[100px] font-semibold">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-12 text-muted-foreground text-sm">
                {filteredTransactionsCount === 0 && searchTerm
                  ? "Tidak ada transaksi yang cocok dengan pencarian."
                  : shouldShowPagination && currentPageLabel
                    ? `Tidak ada transaksi pada periode ${currentPageLabel}.`
                    : "Belum ada transaksi ditemukan."}
              </TableCell>
            </TableRow>
          ) : (
            transactions.map((transaction) => {
              const isIncome = transaction.type === "income"
              return (
                <TableRow key={transaction.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="text-xs text-muted-foreground font-mono">
                    {formatDate(transaction.date)}
                  </TableCell>
                  <TableCell className="font-semibold text-foreground text-sm">
                    {transaction.description}
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-muted text-muted-foreground border border-border/60">
                      {transaction.category}
                    </span>
                  </TableCell>
                  <TableCell>
                    {isIncome ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        <ArrowUpRight className="size-3" /> Pemasukan
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                        <ArrowDownRight className="size-3" /> Pengeluaran
                      </span>
                    )}
                  </TableCell>
                  <TableCell
                    className={`text-right font-mono text-sm font-bold tabular-nums ${
                      isIncome ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                    }`}
                  >
                    {isIncome ? "+" : "-"}
                    {formatCurrency(transaction.amount)}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(transaction)}
                        className="size-8 text-muted-foreground hover:text-foreground hover:bg-muted"
                        title="Edit transaksi"
                      >
                        <Edit className="size-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(transaction.id)}
                        className="size-8 text-rose-600 hover:text-rose-700 hover:bg-rose-500/10 dark:hover:bg-rose-500/20"
                        title="Hapus transaksi"
                      >
                        <Trash2 className="size-3.5" />
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