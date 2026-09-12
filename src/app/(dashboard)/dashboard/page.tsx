import type { Metadata } from "next"
import { DashboardOverview } from "@/components/dashboard/dashboard-overview"
import { generateMetadata as getAppMetadata } from "@/lib/metadata"

export const metadata: Metadata = getAppMetadata({
  title: "Dashboard Keuangan",
  description: "Lihat ringkasan keuangan Anda, termasuk pemasukan, pengeluaran, dan saldo terkini.",
  path: "/dashboard",
})

export default function DashboardPage() {
  return <DashboardOverview />
}
