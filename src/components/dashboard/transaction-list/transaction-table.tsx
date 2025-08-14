"use client"

import React from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2 } from 'lucide-react'
import type { Transaction } from "@/types/transaction"

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
  shouldShowPagination
}: TransactionTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Tanggal</TableHead>
          <TableHead>Deskripsi</TableHead>
          <TableHead>Kategori</TableHead>
          <TableHead>Jenis</TableHead>
          <TableHead className="text-right">Jumlah</TableHead>
          <TableHead className="text-center">Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
              {filteredTransactionsCount === 0 && searchTerm
                ? "Tidak ada transaksi yang cocok dengan pencarian"
                : shouldShowPagination && currentPageLabel
                  ? `Tidak ada transaksi pada periode ${currentPageLabel}`
                  : "Tidak ada transaksi ditemukan"}
            </TableCell>
          </TableRow>
        ) : (
          transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>{formatDate(transaction.date)}</TableCell>
              <TableCell className="font-medium">{transaction.description}</TableCell>
              <TableCell>{transaction.category}</TableCell>
              <TableCell>
                <Badge
                  variant={transaction.type === "income" ? "default" : "default"}
                  className={
                    transaction.type === "income"
                      ? "bg-green-500 text-white hover:bg-green-700"
                      : "bg-red-600 text-white hover:bg-red-700"
                  }
                >
                  {transaction.type === "income" ? "Pemasukan" : "Pengeluaran"}
                </Badge>
              </TableCell>
              <TableCell
                className={`text-right font-medium ${transaction.type === "income" ? "text-green-600" : "text-red-600"
                  }`}
              >
                {transaction.type === "income" ? "+" : "-"}
                {formatCurrency(transaction.amount)}
              </TableCell>
              <TableCell className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => onEdit(transaction)}>
                    <Edit className="size-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(transaction.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}