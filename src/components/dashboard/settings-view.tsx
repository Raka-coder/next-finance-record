"use client"

import { Settings } from "@/components/dashboard/settings"
import { useProfile } from "@/hooks/use-profile"
import { useAuth } from "@/hooks/use-auth"
import Loading from "@/components/loading/loading-component"

export function SettingsView() {
  const { user, loading } = useAuth()
  const { profile, refetch } = useProfile(user?.id)

  if (loading) {
    return <Loading />
  }

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">User not found</p>
      </div>
    )
  }

  return <Settings user={user} profile={profile} onProfileUpdate={refetch} />
}
