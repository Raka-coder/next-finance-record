"use client"

import React from "react"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface TransactionPaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  getPageNumbers: () => (number | 'ellipsis')[]
  currentPageTransactionsCount: number
  currentPageLabel?: string
}

export function TransactionPagination({
  currentPage,
  totalPages,
  onPageChange,
  getPageNumbers,
  currentPageTransactionsCount,
  currentPageLabel
}: TransactionPaginationProps) {
  if (totalPages <= 1) return null

  return (
    <div className="mt-6">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault()
                if (currentPage > 1) {
                  onPageChange(currentPage - 1)
                }
              }}
              className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>

          {getPageNumbers().map((page, index) => (
            <PaginationItem key={index}>
              {page === 'ellipsis' ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    onPageChange(page as number)
                  }}
                  isActive={currentPage === page}
                  className="cursor-pointer"
                >
                  {page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault()
                if (currentPage < totalPages) {
                  onPageChange(currentPage + 1)
                }
              }}
              className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      <div className="mt-4 text-center text-sm text-muted-foreground">
        {currentPageLabel && (
          <>
            Menampilkan periode {currentPage} dari {totalPages} periode •{" "}
            {currentPageTransactionsCount} transaksi pada {currentPageLabel}
          </>
        )}
      </div>
    </div>
  )
}