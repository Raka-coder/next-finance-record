"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useAuth } from "@/hooks/use-auth"
import LoadingGlobal from "@/components/loading/loading-global"
import LoadingToDashboard from "@/components/loading/loading-to-dashboard"

interface AuthLayoutProps {
  children: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const { user, loading, isAuthenticated, redirectToDashboard } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Check if user is already authenticated
    if (isAuthenticated && user) {
      redirectToDashboard()
      toast.message("Login Berhasil!", {
        description: "Selamat Datang Kembali!",
      })
    }
  }, [isAuthenticated, user, redirectToDashboard])

  // Listen for auth changes
  useEffect(() => {
    if (isAuthenticated && user) {
      toast.message("Login Berhasil!", {
        description: "Selamat Datang!",
      })
      redirectToDashboard()
    }
  }, [isAuthenticated, user, redirectToDashboard])

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