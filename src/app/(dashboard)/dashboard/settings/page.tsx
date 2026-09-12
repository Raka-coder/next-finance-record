import type { Metadata } from "next"
import { SettingsView } from "@/components/dashboard/settings-view"
import { generateMetadata as getAppMetadata } from "@/lib/metadata"

export const metadata: Metadata = getAppMetadata({
  title: "Pengaturan",
  description: "Kelola pengaturan akun dan preferensi aplikasi keuangan Anda.",
  path: "/dashboard/settings",
})

export default function PengaturanPage() {
  return <SettingsView />
}