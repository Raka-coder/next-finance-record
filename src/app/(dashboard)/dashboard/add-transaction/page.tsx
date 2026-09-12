import type { Metadata } from "next"
import { AddTransactionView } from "@/components/dashboard/add-transaction-view"
import { generateMetadata as getAppMetadata } from "@/lib/metadata"

export const metadata: Metadata = getAppMetadata({
  title: "Tambah Transaksi",
  description: "Tambahkan transaksi pemasukan atau pengeluaran baru ke dalam catatan keuangan Anda.",
  path: "/dashboard/add-transaction",
})

export default function TambahTransaksiPage() {
  return <AddTransactionView />
}
