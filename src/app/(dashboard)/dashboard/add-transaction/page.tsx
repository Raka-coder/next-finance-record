"use client"

import { AddTransaction } from "@/components/dashboard/add-transaction"
import { useTransactions } from "@/hooks/use-transaction"
import { useRouter } from "next/navigation"
import { DashboardSEO } from "@/components/dashboard/dashboard-seo"

export default function TambahTransaksiPage() {
  const { addTransaction } = useTransactions()
  const router = useRouter()

  const handleAddTransaction = async (transaction: any) => {
    try {
      const result = await addTransaction(transaction)
      // Redirect ke daftar transaksi setelah berhasil menambah
      router.push("/dashboard")
      return result
    } catch (error) {
      throw error
    }
  }

  return (
    <>
      <DashboardSEO 
        title="Tambah Transaksi" 
        description="Tambahkan transaksi pemasukan atau pengeluaran baru ke dalam catatan keuangan Anda."
      />
      <AddTransaction onAddTransaction={handleAddTransaction} />
    </>
  )
}
