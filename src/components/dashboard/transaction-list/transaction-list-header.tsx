"use client"

import React from "react"
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, List, CalendarIcon, Plus } from 'lucide-react'

interface TransactionListHeaderProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  filteredTransactionsCount: number
  totalPages: number
  currentPage: number
  currentPageLabel?: string
  shouldShowPagination: boolean
  onOpenAddTransaction?: () => void
}

export function TransactionListHeader({
  searchTerm,
  setSearchTerm,
  filteredTransactionsCount,
  totalPages,
  currentPage,
  currentPageLabel,
  shouldShowPagination,
  onOpenAddTransaction,
}: TransactionListHeaderProps) {
  return (
    <CardHeader>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <CardTitle className="flex items-center gap-2">
            <List className="size-5" />
            Daftar Transaksi
          </CardTitle>
          <CardDescription className="mt-1">
            Kelola semua transaksi pemasukan dan pengeluaran Anda
            {shouldShowPagination && (
              <span className="ml-2 text-sm">
                ({filteredTransactionsCount} transaksi, {totalPages} periode)
              </span>
            )}
          </CardDescription>
        </div>

        {onOpenAddTransaction && (
          <Button
            onClick={onOpenAddTransaction}
            className="self-start sm:self-auto font-semibold gap-1.5 shadow-sm cursor-pointer"
          >
            <Plus className="size-4" />
            <span>Tambah Transaksi</span>
          </Button>
        )}
      </div>

      <div className="flex items-center space-x-2 mt-4">
        <Search className="size-4 text-muted-foreground" />
        <Input
          placeholder="Cari transaksi..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        {shouldShowPagination && currentPageLabel && (
          <div className="ml-auto flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarIcon className="size-4" />
              <span className="font-medium">
                Periode {currentPage}: {currentPageLabel}
              </span>
            </div>
          </div>
        )}
      </div>
    </CardHeader>
  )
}