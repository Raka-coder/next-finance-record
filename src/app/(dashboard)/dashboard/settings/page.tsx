"use client"

import { useEffect, useState } from "react"
import { Settings } from "@/components/dashboard/setting"
import { useProfile } from "@/hooks/use-profile"
import { supabase } from "@/utils/supabase/client"
import type { User } from "@supabase/supabase-js"
import Loading from "@/components/loading-component"

export default function PengaturanPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const { profile, updateProfile } = useProfile(user?.id)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <Loading />
    )
  }

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">User not found</p>
      </div>
    )
  }

  return <Settings user={user} profile={profile} />
}
