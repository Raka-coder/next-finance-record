"use client"

import { Settings } from "@/components/dashboard/settings"
import { useProfile } from "@/hooks/use-profile"
import { useAuth } from "@/hooks/use-auth"
import Loading from "@/components/loading/loading-component"
import { DashboardSEO } from "@/components/dashboard/dashboard-seo"

export default function PengaturanPage() {
  const { user, loading } = useAuth()
  const { profile } = useProfile(user?.id)

  if (loading) {
    return (
      <>
        <DashboardSEO 
          title="Pengaturan" 
          description="Kelola pengaturan akun dan preferensi aplikasi keuangan Anda."
        />
        <Loading />
      </>
    )
  }

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">User not found</p>
      </div>
    )
  }

  return (
    <>
      <DashboardSEO 
        title="Pengaturan" 
        description="Kelola pengaturan akun dan preferensi aplikasi keuangan Anda."
      />
      <Settings user={user} profile={profile} />
    </>
  )
}