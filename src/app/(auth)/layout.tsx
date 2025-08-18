"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/utils/supabase/client"
import { toast } from "sonner"
import LoadingGlobal from "@/components/loading/loading-global"
import LoadingToDashboard from "@/components/loading/loading-to-dashboard"

interface AuthLayoutProps {
  children: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if user is already authenticated
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsAuthenticated(true)
        router.push("/dashboard")
        toast.message("Login Berhasil!", {
          description: "Selamat Datang Kembali!",
        })
        return
      }
      setIsAuthenticated(false)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setIsAuthenticated(true)
        toast.message("Login Berhasil!", {
          description: "Selamat Datang!",
        })
        router.push("/dashboard")
        return
      }
      setIsAuthenticated(false)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [router])

  if (loading) {
    return (
      <LoadingGlobal />
    )
  }

  // Don't render auth forms if already authenticated (will redirect)
  if (isAuthenticated) {
    return (
      <LoadingToDashboard />
    )
  }

  return <div className="min-h-screen flex items-center justify-center px-4">{children}</div>
}
