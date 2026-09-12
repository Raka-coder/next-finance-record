import type { Metadata } from "next"
import { TransactionListView } from "@/components/dashboard/transaction-list-view"
import { generateMetadata as getAppMetadata } from "@/lib/metadata"

export const metadata: Metadata = getAppMetadata({
  title: "Daftar Transaksi",
  description: "Lihat dan kelola semua transaksi keuangan Anda dalam satu tempat.",
  path: "/dashboard/transaction-lists",
})

export default function DaftarTransaksiPage() {
  return <TransactionListView />
}
