"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import { toast } from "sonner"
import { useAuth } from "@/hooks/use-auth"
import LoadingGlobal from "@/components/loading/loading-global"
import LoadingToDashboard from "@/components/loading/loading-to-dashboard"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"

interface AuthLayoutProps {
  children: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const { user, loading, isAuthenticated, redirectToDashboard } = useAuth()
  const toastShown = useRef(false)

  useEffect(() => {
    if (isAuthenticated && user) {
      const currentPath = window.location.pathname
      if (currentPath.startsWith('/confirm') || currentPath.startsWith('/update-password')) {
        return
      }

      const hasVisited = localStorage.getItem("hasVisitedDashboard")
      if (!hasVisited && !toastShown.current) {
        localStorage.setItem("hasVisitedDashboard", "true")
        toastShown.current = true
        toast.message("Login Berhasil!", {
          description: "Selamat Datang!",
        })
      } else if (!toastShown.current) {
        toastShown.current = true
      }

      redirectToDashboard()
    }

    const handleBeforeUnload = () => {
      if (!isAuthenticated) {
        localStorage.removeItem("hasVisitedDashboard")
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
      toastShown.current = false
    }
  }, [isAuthenticated, user, redirectToDashboard])

  const currentPath = typeof window !== 'undefined' ? window.location.pathname : ''
  const isConfirmOrUpdate = currentPath.startsWith('/confirm') || currentPath.startsWith('/update-password')

  if (loading) {
    return <LoadingGlobal />
  }

  if (isAuthenticated && user && !isConfirmOrUpdate) {
    return <LoadingToDashboard />
  }

  return (
    <div className="relative min-h-[100dvh] w-full flex items-center justify-center bg-background text-foreground selection:bg-foreground selection:text-background px-4 py-8">
      {/* Floating Theme Toggle in top right */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
        <ThemeToggle />
      </div>

      {/* Main Content Area */}
      <main className="w-full max-w-md">
        {children}
      </main>
    </div>
  )
}