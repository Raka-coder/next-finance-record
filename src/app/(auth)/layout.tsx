"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import { toast } from "sonner"
import { useAuth } from "@/hooks/use-auth"
import LoadingGlobal from "@/components/loading/loading-global"
import LoadingToDashboard from "@/components/loading/loading-to-dashboard"

interface AuthLayoutProps {
  children: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const { user, loading, isAuthenticated, redirectToDashboard } = useAuth()
  const toastShown = useRef(false)

  useEffect(() => {
    // Check if user is already authenticated
    if (isAuthenticated && user) {
      // Get current path
      const currentPath = window.location.pathname
      
      // Skip redirect for confirm and update-password routes
      if (currentPath.startsWith('/confirm') || currentPath.startsWith('/update-password')) {
        return
      }
      
      // Cek apakah ini kunjungan pertama setelah login
      const hasVisited = localStorage.getItem("hasVisitedDashboard")
      
      if (!hasVisited && !toastShown.current) {
        // Ini adalah kunjungan pertama setelah login
        localStorage.setItem("hasVisitedDashboard", "true")
        toastShown.current = true
        toast.message("Login Berhasil!", {
          description: "Selamat Datang!",
        })
      } else if (!toastShown.current) {
        // Ini adalah kunjungan kembali (misalnya setelah refresh)
        toastShown.current = true
        // toast.message("Login Berhasil!", {
        //   description: "Selamat Datang Kembali!",
        // })
      }
      
      redirectToDashboard()
    }
    
    // Bersihkan flag saat user logout
    const handleBeforeUnload = () => {
      if (!isAuthenticated) {
        localStorage.removeItem("hasVisitedDashboard")
      }
    }
    
    window.addEventListener("beforeunload", handleBeforeUnload)
    
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
      // Reset toastShown saat komponen di-unmount
      toastShown.current = false
    }
  }, [isAuthenticated, user, redirectToDashboard])

  const currentPath = typeof window !== 'undefined' ? window.location.pathname : ''
  const isConfirmOrUpdate = currentPath.startsWith('/confirm') || currentPath.startsWith('/update-password')

  if (loading) {
    return <LoadingGlobal />
  }

  // Don't render loading for confirm and update-password routes
  if (isAuthenticated && user && !isConfirmOrUpdate) {
    return <LoadingToDashboard />
  }

  return <div className="min-h-screen flex items-center justify-center px-4">{children}</div>
}